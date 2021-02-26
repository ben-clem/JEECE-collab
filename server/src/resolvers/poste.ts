import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Poste } from "../entities/Poste";

@Resolver()
export class PosteResolver {
  @Query(() => [Poste])
  postes(): Promise<Poste[]> {
    return Poste.find();
  }

  @Query(() => Poste, { nullable: true })
  poste(@Arg("name") name: string): Promise<Poste | undefined> {
    return Poste.findOne({ name });
  }

  @Mutation(() => Poste)
  async createPoste(@Arg("name") name: string): Promise<Poste> {
    return Poste.create({ name }).save();
  }

  @Mutation(() => Poste)
  async updatePoste(
    @Arg("oldName") oldName: string,
    @Arg("newName") newName: string
  ): Promise<Poste | null> {
    const poste = await Poste.findOne({ name: oldName });
    if (!poste) {
      return null;
    } else if (typeof newName !== "undefined") {
      poste.name = newName;
      poste.updatedAt = new Date();
      await Poste.update(oldName, poste);
    }
    return poste;
  }

  @Mutation(() => Boolean)
  async deletePoste(@Arg("name") name: string): Promise<boolean> {
    try {
      await Poste.delete(name);
    } catch {
      return false;
    }
    return true;
  }
}
