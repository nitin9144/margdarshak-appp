
"use server";

import { z } from "zod";
// In a real app, you'd use a database, but for this example, we'll use a simple JSON file.
// We are importing it this way to avoid caching issues in the serverless environment.
import fs from 'fs';
import path from 'path';
import type { ProvideSkillAssessmentOutput } from '@/ai/flows/provide-skill-assessment';
import type { SimulateCareerPathsOutput } from '@/ai/flows/simulate-career-paths';
import type { GenerateProjectIdeasOutput } from '@/ai/flows/generate-project-ideas';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

const readUsers = () => {
    try {
        const jsonData = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Could not read users file:", error);
        return { users: [] };
    }
};

const writeUsers = (data: any) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Could not write to users file:", error);
    }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function logIn(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;
  const { users } = readUsers();

  const user = users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    // In a real app, you would generate a session token (e.g., JWT) here.
    // For simplicity, we'll just return the user object.
    const userToStore = { id: user.id, email: user.email };
    return { success: true, user: userToStore };
  }

  return { error: "Invalid email or password." };
}

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signUp(prevState: any, formData: FormData) {
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;
  const data = readUsers();
  const { users } = data;

  const existingUser = users.find((u: any) => u.email === email);
  if (existingUser) {
    return { error: "This email is already registered. Please log in." };
  }

  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password, // In a real app, NEVER store plain text passwords. Always hash them.
    assessmentResult: null,
    careerPathResult: null,
    projectIdeasResult: null,
  };

  data.users.push(newUser);
  writeUsers(data);
  
  const userToStore = { id: newUser.id, email: newUser.email };
  return { success: true, user: userToStore };
}


// Function to get user data by ID
export async function getUserData(userId: string) {
    const { users } = readUsers();
    const user = users.find((u: any) => u.id === userId);
    if (!user) {
        return { error: 'User not found' };
    }
    return {
        assessmentResult: user.assessmentResult,
        careerPathResult: user.careerPathResult,
        projectIdeasResult: user.projectIdeasResult,
    };
}

// Functions to save data for a user
export async function saveSkillAssessment(userId: string, data: ProvideSkillAssessmentOutput) {
    const allData = readUsers();
    const userIndex = allData.users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
        allData.users[userIndex].assessmentResult = data;
        writeUsers(allData);
    }
}

export async function saveCareerPaths(userId: string, data: SimulateCareerPathsOutput) {
    const allData = readUsers();
    const userIndex = allData.users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
        allData.users[userIndex].careerPathResult = data;
        writeUsers(allData);
    }
}

export async function saveProjectIdeas(userId: string, data: GenerateProjectIdeasOutput) {
    const allData = readUsers();
    const userIndex = allData.users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
        allData.users[userIndex].projectIdeasResult = data;
        writeUsers(allData);
    }
}
