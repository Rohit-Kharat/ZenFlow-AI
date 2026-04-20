import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RecommendationEngine {

  async getRoutine(moodScore: number, sleepHours: number) {
    try {
      
      const hour = new Date().getHours();
      let timeTag = 'morning';
      if (hour >= 11 && hour < 17) timeTag = 'afternoon';
      else if (hour >= 17 && hour < 22) timeTag = 'evening';
      else if (hour >= 22 || hour < 5) timeTag = 'night';

      // 2. Define target tags based on mood and sleep
      let targetTags: string[] = [];

      // Priority 1: Sleep Deprivation
      if (sleepHours < 6) {
        targetTags = ['recovery', 'gentle', 'sleep', 'relaxing', 'beginner'];
      } 
      // Priority 2: Low Mood / Anxiety
      else if (moodScore <= 3) {
        targetTags = ['calm', 'stress-relief', 'anxiety', 'gentle', 'beginner'];
      } 
      // Priority 3: High Energy
      else if (moodScore >= 8) {
        targetTags = ['energy', 'strength', 'power', 'intermediate', 'challenge'];
      } 
      // Fallback: Balanced
      else {
        targetTags = ['balanced', 'flow', 'hatha', 'stability'];
      }

      // Add time-specific context (Morning/Evening)
      if (timeTag === 'morning' && moodScore > 5) targetTags.push('morning', 'warm-up');
      if (timeTag === 'evening' || timeTag === 'night') targetTags.push('evening', 'relaxing');

      // 3. Query all public routines
      const routines = await prisma.yogaRoutine.findMany({
        where: { userId: null }
      });

      if (routines.length === 0) return null;

      // 4. Score routines based on tag matches
      const scoredRoutines = routines.map(routine => {
        const matches = routine.tags.filter(tag => targetTags.includes(tag)).length;
        return { ...routine, score: matches };
      });

      // Sort by score and pick from the top matches
      scoredRoutines.sort((a, b) => b.score - a.score);
      const topScore = scoredRoutines[0].score;
      const topMatches = scoredRoutines.filter(r => r.score === topScore);

      // Randomly select one from the top matches for variety
      const selected = topMatches[Math.floor(Math.random() * topMatches.length)];

      return {
        explanation: this.getExplanation(moodScore, sleepHours, selected.title, timeTag),
        routine: selected.steps || []
      };
    } catch (error) {
      console.error('Logic Engine Error:', error);
      return null;
    }
  }

  private getExplanation(mood: number, sleep: number, title: string, timeTag: string) {
    let context = '';
    if (sleep < 6) context = `Since you only got ${sleep} hours of sleep, your body needs a gentle recovery practice.`;
    else if (mood <= 3) context = `I'm sorry you're having a tough day. Let's practice some calm to find your center.`;
    else if (mood >= 8) context = `You've got amazing energy today! Let's channel that into this powerful flow.`;
    else context = `It's a great time for a balanced practice to maintain your wellness.`;

    const timeContext = timeTag === 'morning' ? " It's a perfect start to your morning." : 
                       (timeTag === 'evening' || timeTag === 'night') ? " This will help you unwind for the evening." : "";

    return `${context} Based on your state, "${title}" is the perfect match.${timeContext}`;
  }
}

export const recommendationEngine = new RecommendationEngine();
