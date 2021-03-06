import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "../entities/Service";

@Resolver()
export class ServiceResolver {
  @Query(() => [Service])
  services(): Promise<Service[]> {
    return Service.find();
  }

  @Query(() => Service, { nullable: true })
  serviceByName(@Arg("name") name: string): Promise<Service | undefined> {
    return Service.findOne({ name });
  }

  @Query(() => Service, { nullable: true })
  serviceById(
    @Arg("id", (type) => Int) id: number
  ): Promise<Service | undefined> {
    return Service.findOne({ id });
  }

  @Mutation(() => Service)
  async createService(@Arg("name") name: string): Promise<Service> {
    return Service.create({ name }).save();
  }

  @Mutation(() => Service)
  async updateService(
    @Arg("id", (type) => Int) id: number,
    @Arg("newName") newName: string
  ): Promise<Service | null> {
    const service = await Service.findOne({ id });
    if (!service) {
      return null;
    } else if (typeof newName !== "undefined") {
      service.name = newName;
      service.updatedAt = new Date();
      await Service.update(id, service);
    }
    return service;
  }

  @Mutation(() => Boolean)
  async deleteService(
    @Arg("id", (type) => Int, { nullable: true }) id: string
  ): Promise<boolean> {
    try {
      await Service.delete(id);
    } catch {
      return false;
    }
    return true;
  }
}
