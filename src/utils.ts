import { readdirSync } from 'fs';

export  const isFromNodeModules = imported => readdirSync('./node_modules').indexOf(imported.moduleName.split('/')[0]) !== -1;

export const isReactModule = imported => Boolean(imported.moduleName.match(/^(react|prop-types|redux)/));

export const isStylesModule = imported => Boolean(imported.moduleName.match(/\.(s?css|less)$/));

export const isTypesModule = imported => Boolean(imported.moduleName.match(/types$/));

export const isConstantsModule = imported =>
    Boolean(imported.moduleName.match(/(constants\/|constants$)/));

export const isUtilsModule = imported => Boolean(imported.moduleName.match(/(utils\/|utils$)/));

export const isNotSpecial = imported => !(isStylesModule(imported) || isConstantsModule(imported) || isTypesModule(imported) || isUtilsModule(imported));

export const reactComparator = fn => (name1, name2) => {
    const fixedOrder = ['react', 'prop-types'];
    let i1 = fixedOrder.indexOf(name1);
    let i2 = fixedOrder.indexOf(name2);

    i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
    i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;

    return i1 === i2 ? fn(name1, name2) : i1 - i2;
  };