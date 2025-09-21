

"use server";

import { generateProjectIdeas } from "@/ai/flows/generate-project-ideas";
import { provideSkillAssessment } from "@/ai/flows/provide-skill-assessment";
import { simulateCareerPaths } from "@/ai/flows/simulate-career-paths";
import { saveSkillAssessment, saveCareerPaths, saveProjectIdeas } from "@/app/auth-actions";
import { z } from "zod";

const skillSchema = z.object({
  narrative: z.string().min(50, "Please provide a more detailed narrative of at least 50 characters."),
  userId: z.string(),
});

export async function handleSkillAssessment(prevState: any, formData: FormData) {
  const validatedFields = skillSchema.safeParse({
    narrative: formData.get("narrative"),
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.narrative?.join(", "),
    };
  }

  try {
    const result = await provideSkillAssessment({ narrative: validatedFields.data.narrative });
    await saveSkillAssessment(validatedFields.data.userId, result);
    return { data: result };
  } catch (e) {
    return { error: "An error occurred during assessment. Please try again." };
  }
}

const careerSchema = z.object({
  skillsAndInterests: z.string(),
  userId: z.string(),
});

export async function handleCareerPath(prevState: any, formData: FormData) {
  const validatedFields = careerSchema.safeParse({
    skillsAndInterests: formData.get("skillsAndInterests"),
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid input for career path simulation.",
    };
  }
  
  try {
    const result = await simulateCareerPaths({ skillsAndInterests: validatedFields.data.skillsAndInterests });
    await saveCareerPaths(validatedFields.data.userId, result);
    return { data: result };
  } catch (e) {
    return { error: "An error occurred during simulation. Please try again." };
  }
}


const projectSchema = z.object({
  skills: z.string(),
  interests: z.string(),
  careerGoals: z.string(),
  userId: z.string(),
});

export async function handleProjectIdeas(prevState: any, formData: FormData) {
    const validatedFields = projectSchema.safeParse({
      skills: formData.get("skills"),
      interests: formData.get("interests"),
      careerGoals: formData.get("careerGoals"),
      userId: formData.get("userId"),
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid input for project idea generation.",
        };
    }

    try {
        const result = await generateProjectIdeas(validatedFields.data);
        await saveProjectIdeas(validatedFields.data.userId, result);
        return { data: result };
    } catch (e) {
        return { error: "An error occurred while generating ideas. Please try again." };
    }
}
