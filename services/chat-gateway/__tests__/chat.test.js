import { io } from "socket.io-client";
import { env } from "../src/config/env.js";
import { jest } from '@jest/globals';

const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3NmQ0NDMyLTAzOTctNDM2OC1iOTRlLWYxMDkwMGJjYzc3ZCIsInVzZXJuYW1lIjoic3VtZXNocyIsImlhdCI6MTc1MzI3MzI0MiwiZXhwIjoxNzUzODc4MDQyfQ.gmEb6n7ytOkYbrpShGH-3RCzb8Uy95TYbYbomVheP0U";
const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiMjA2MjEwLTRmMDEtNGVlOS1hOTQyLTNmNTgyODdkNDRhNiIsInVzZXJuYW1lIjoic3VtZXNoX3MiLCJpYXQiOjE3NTMyNzM0MDksImV4cCI6MTc1Mzg3ODIwOX0.J7oPEtt9rCowawR3EMrUKXYceY9EKZY4695zJCxyV3o";
const user_1 = "e76d4432-0397-4368-b94e-f10900bcc77d";
const user_2 = "ab206210-4f01-4ee9-a942-3f58287d44a6";

