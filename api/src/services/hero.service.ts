import { Hero, IHero } from '../models/hero.model';
import { UpdateHeroInput } from '../validations/hero.validation'; // Imports the interface we defined manually

class HeroService {
  
  async getHeroSection(): Promise<IHero | null> {
    const hero = await Hero.findOne({ sectionId: 'homepage_hero' });
    return hero;
  }

  async updateHeroSection(data: UpdateHeroInput): Promise<IHero> {
    const hero = await Hero.findOneAndUpdate(
      { sectionId: 'homepage_hero' },
      {
        $set: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: data.isActive ?? true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!hero) {
      throw new Error("Failed to update hero section");
    }

    return hero;
  }
}

export const heroService = new HeroService();