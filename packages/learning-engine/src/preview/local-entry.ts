import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { installBridge } from './bridge';
import * as Router from 'react-router-dom';
import * as Toolkit from '@reduxjs/toolkit';
import * as Redux from 'react-redux';
import * as Query from '@tanstack/react-query';
import * as testing from '@testing-library/react';

installBridge({ React, createRoot, testing, libraries: { 'react-router-dom': { ...Router }, '@reduxjs/toolkit': { ...Toolkit }, 'react-redux': { ...Redux }, '@tanstack/react-query': { ...Query } } });
