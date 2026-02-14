/// <reference types="astro/client" />

interface User {
  id: string;
  email: string;
  role: string;
}

declare namespace App {
  interface Locals {
    user?: User;
  }
}
