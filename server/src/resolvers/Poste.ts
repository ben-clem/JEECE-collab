import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Poste } from "../entities/Poste";

@Resolver()
export class PosteResolver {
  @Query(() => [Poste])
  postes(): Promise<Poste[]> {
    return Poste.find();
  }

  @Query(() => Poste, { nullable: true })
  posteByName(@Arg("name") name: string): Promise<Poste | undefined> {
    return Poste.findOne({ name });
  }

  @Query(() => Poste, { nullable: true })
  posteByID(
    @Arg("id", (type) => Int, { nullable: true }) id: number
  ): Promise<Poste | undefined> {
    return Poste.findOne({ id });
  }

  @Mutation(() => Poste)
  async createPoste(@Arg("name") name: string): Promise<Poste> {
    return Poste.create({ name }).save();
  }

  @Mutation(() => Poste)
  async updatePoste(
    @Arg("id", (type) => Int, { nullable: true }) id: number,
    @Arg("newName") newName: string
  ): Promise<Poste | null> {
    const poste = await Poste.findOne({ id });
    if (!poste) {
      return null;
    } else if (typeof newName !== "undefined") {
      poste.name = newName;
      poste.updatedAt = new Date();
      await Poste.update(id, poste);
    }
    return poste;
  }

  @Mutation(() => Boolean)
  async deletePoste(
    @Arg("id", (type) => Int, { nullable: true }) id: string
  ): Promise<boolean> {
    try {
      await Poste.delete(id);
    } catch {
      return false;
    }
    return true;
  }
}
