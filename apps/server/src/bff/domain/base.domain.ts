import { toGlobalId, fromGlobalId } from 'graphql-relay';

export class BaseDomain {
  static readonly __typename: string;
  static uuidToRelay(id: string): string {
    return toGlobalId(this.__typename, id);
  }
  static relayToUuid(id: string): string {
    return fromGlobalId(id).id;
  }
}
