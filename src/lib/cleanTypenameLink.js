// update Mutations failed because of automaticallly added __typename field, this link strips the query of __typename before sending it out

// based on the following gist:
// https://gist.github.com/cdelgadob/4041818430bc5802016332dbe5611570#file-cleantypenamefieldlink-ts-L24
import { ApolloLink } from 'apollo-link';

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = omitDeep(operation.variables, '__typename');
  }
  return forward(operation).map((data) => {
    return data;
  });
});

function omitDeep(obj, key) {
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach((i) => {
    if (i !== key) {
      const val = obj[i];
      if (val instanceof Date) newObj[i] = val;
      if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key);
      else if (val && val.constructor === File) newObj[i] = val;
      else if (typeof val === 'object' && val !== null)
        newObj[i] = omitDeep(val, key);
      else newObj[i] = val;
    }
  });
  return newObj;
}

function omitDeepArrayWalk(arr, key) {
  return arr.map((val) => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    if (typeof val === 'object') return omitDeep(val, key);
    return val;
  });
}

export default cleanTypenameLink;
