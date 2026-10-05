import * as Babel from '@babel/standalone';
import type { PluginObj } from '@babel/core';
import type { CompiledCode } from '@react-quest/shared';

export function compileCode(source: string): CompiledCode {
  if (source.length > 65536) throw new Error('فایل تمرین باید کمتر از ۶۴ کیلوبایت باشد.');
  if (source.includes('__reactQuestSteps') || source.includes('__reactQuestTrace')) throw new Error('نام‌های __reactQuestSteps و __reactQuestTrace برای محیط اجرا رزرو شده‌اند.');
  const components = new Set<string>();
  const hooks = new Set<string>();
  const aliases = new Map<string, string>();
  const namespaces = new Set<string>();
  const functions: Record<string, number> = {};
  const tree: NonNullable<CompiledCode['analysis']['tree']> = [];
  const warnings = new Set<string>();
  const t = Babel.packages.types;
  const plugin: PluginObj = {
    visitor: {
      Program(path) {
        for (const statement of path.node.body) {
          if (!t.isImportDeclaration(statement) || statement.source.value !== 'react') continue;
          for (const specifier of statement.specifiers) {
            if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) aliases.set(specifier.local.name, specifier.imported.name);
            else namespaces.add(specifier.local.name);
          }
        }
      },
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (!name) return;
        functions[name] = (path.node.loc?.end.line ?? 0) - (path.node.loc?.start.line ?? 0) + 1;
        if (/^[A-Z]/.test(name)) {
          components.add(name);
          path.node.body.body.unshift(Babel.packages.template.statement.ast(`globalThis.__reactQuestTrace?.component(${JSON.stringify(name)});`));
        }
      },
      VariableDeclarator(path) {
        if (t.isIdentifier(path.node.id) && (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init))) {
          const name = path.node.id.name;
          functions[name] = (path.node.loc?.end.line ?? 0) - (path.node.loc?.start.line ?? 0) + 1;
          if (/^[A-Z]/.test(name)) {
            components.add(name);
            if (!t.isBlockStatement(path.node.init.body)) path.node.init.body = t.blockStatement([t.returnStatement(path.node.init.body)]);
            path.node.init.body.body.unshift(Babel.packages.template.statement.ast(`globalThis.__reactQuestTrace?.component(${JSON.stringify(name)});`));
          }
        }
      },
      JSXOpeningElement(path) {
        const owner = path.findParent(parent => (parent.isFunctionDeclaration() && /^[A-Z]/.test(parent.node.id?.name ?? '')) || ((parent.isArrowFunctionExpression() || parent.isFunctionExpression()) && parent.parentPath?.isVariableDeclarator() && t.isIdentifier(parent.parentPath.node.id) && /^[A-Z]/.test(parent.parentPath.node.id.name)));
        let parent: string | undefined;
        if (owner?.isFunctionDeclaration()) parent = owner.node.id?.name;
        else if (owner?.parentPath?.isVariableDeclarator() && t.isIdentifier(owner.parentPath.node.id)) parent = owner.parentPath.node.id.name;
        if (parent && t.isJSXIdentifier(path.node.name) && /^[A-Z]/.test(path.node.name.name)) {
          const child = path.node.name.name;
          const props = path.node.attributes.flatMap(attribute => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && attribute.name.name !== 'key' ? [attribute.name.name] : []);
          if (path.parentPath.isJSXElement() && path.parentPath.node.children.some(child => t.isJSXText(child) ? child.value.trim().length > 0 : !(t.isJSXExpressionContainer(child) && t.isJSXEmptyExpression(child.expression)))) props.push('children');
          if (!tree.some(edge => edge.parent === parent && edge.child === child)) tree.push({ parent, child, props });
        }
        const map = path.findParent(parent => parent.isCallExpression() && t.isMemberExpression(parent.node.callee) && t.isIdentifier(parent.node.callee.property, { name: 'map' }));
        const directReturn = path.parentPath.parentPath;
        if (map && (directReturn?.isArrowFunctionExpression() || directReturn?.isReturnStatement()) && !path.node.attributes.some(attribute => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name, { name: 'key' }))) warnings.add('عضو مستقیم لیست را با key پایدار مشخص کن.');
      },
      CallExpression(path) {
        const callee = path.node.callee;
        if (t.isIdentifier(callee) && aliases.has(callee.name)) hooks.add(aliases.get(callee.name)!);
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && namespaces.has(callee.object.name) && t.isIdentifier(callee.property)) hooks.add(callee.property.name);
      },
      Loop(path) {
        const guard = Babel.packages.template.statement.ast('if (++__reactQuestSteps > 10000) throw new Error("Execution limit exceeded: check your loop.");');
        if (!t.isBlockStatement(path.node.body)) path.node.body = t.blockStatement([path.node.body]);
        path.node.body.body.unshift(guard);
      }
    }
  };
  const instrumented = Babel.transform(`let __reactQuestSteps = 0;\n${source}`, { filename: 'App.jsx', plugins: [plugin], parserOpts: { plugins: ['jsx'] } }).code;
  if (!instrumented) throw new Error('کد قابل اجرا تولید نشد.');
  const transformed = Babel.transform(instrumented, {
    filename: 'App.jsx', presets: [['react', { runtime: 'classic' }]], plugins: ['transform-modules-commonjs']
  }).code;
  if (!transformed) throw new Error('تبدیل JSX ناموفق بود.');
  return { code: transformed, safeSource: instrumented, analysis: { components: [...components], hooks: [...hooks], functions, tree, warnings: [...warnings] } };
}
