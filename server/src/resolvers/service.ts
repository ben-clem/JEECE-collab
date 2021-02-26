import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "../entities/Service";

@Resolver()
export class ServiceResolver {
  @Query(() => [Service])
  services(): Promise<Service[]> {
    return Service.find();
  }

  @Query(() => Service, { nullable: true })
  service(@Arg("name") name: string): Promise<Service | undefined> {
    return Service.findOne({ name });
  }

  @Mutation(() => Service)
  async createService(@Arg("name") name: string): Promise<Service> {
    return Service.create({ name }).save();
  }

  @Mutation(() => Service)
  async updateService(
    @Arg("oldName") oldName: string,
    @Arg("newName") newName: string
  ): Promise<Service | null> {
    const service = await Service.findOne({ name: oldName });
    if (!service) {
      return null;
    } else if (typeof newName !== "undefined") {
      service.name = newName;
      service.updatedAt = new Date();
      await Service.update(oldName, service);
    }
    return service;
  }

  @Mutation(() => Boolean)
  async deleteService(@Arg("name") name: string): Promise<boolean> {
    try {
      await Service.delete(name);
    } catch {
      return false;
    }
    return true;
  }
}
