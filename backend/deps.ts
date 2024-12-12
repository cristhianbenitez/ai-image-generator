// Express framework
import express, { Application } from 'express';
import { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from './db.js';

// Re-exports
export {
  express,
  Application,
  Router,
  cors as oakCors,
  dotenv,
  PrismaClient,
  jwt,
  prisma
};

// Types
export * from './types/index.js';
export * from './types/errors.js';
