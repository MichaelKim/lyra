// @flow strict

// A utility type for deeply nested $Shape
type $DeepShape<O: Object> = Object &
  $Shape<$ObjMap<O, (<V: Object>(V) => $DeepShape<V>) | (<V>(V) => V)>>;

declare module 'updeep' {
  declare module.exports: <T>(update: $DeepShape<T>, object: T) => T;
}
