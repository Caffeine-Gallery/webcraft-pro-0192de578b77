import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Design = string;
export type DesignId = bigint;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'deleteDesign' : ActorMethod<[DesignId], Result>,
  'getDesign' : ActorMethod<[DesignId], [] | [Design]>,
  'listDesigns' : ActorMethod<[], Array<[DesignId, Design]>>,
  'publishDesign' : ActorMethod<[DesignId], Result_1>,
  'saveDesign' : ActorMethod<[Design], DesignId>,
  'updateDesign' : ActorMethod<[DesignId, Design], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
