import { Service } from "../entities/Service";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Document } from "../entities/Document";
import { Poste } from "../entities/Poste";

@Resolver()
export class DocumentResolver {
  @Mutation(() => Document)
  async addDocument(
    @Arg("path", (type) => String) path: string,
    @Arg("name", (type) => String) name: string,
    @Arg("servicesIds", (type) => [Int], { nullable: true })
    servicesIds: number[],
    @Arg("postesIds", (type) => [Int], { nullable: true }) postesIds: number[]
  ): Promise<Document> {
    try {
      const services: Service[] = [];
      for (const serviceId of servicesIds) {
        const service = await getConnection()
          .getRepository(Service)
          .createQueryBuilder("service")
          .where("service.id = :id", { id: serviceId })
          .getOneOrFail();
        services.push(service);
      }

      const postes: Poste[] = [];
      for (const posteId of postesIds) {
        const poste = await getConnection()
          .getRepository(Poste)
          .createQueryBuilder("poste")
          .where("poste.id = :id", { id: posteId })
          .getOneOrFail();
        postes.push(poste);
      }

      const document = Document.create({
        filePath: path,
        name,
        services,
        postes,
      });
      return await Document.save(document);
      
    } catch (err) {
      return err;
    }
  }
}
