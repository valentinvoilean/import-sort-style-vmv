import { readdirSync } from 'fs';

import { IStyleAPI, IStyleItem } from 'import-sort-style';

const fixedOrder = ['react', 'prop-types'];

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    dotSegmentCount,
    isScopedModule,
    isNodeModule,
    moduleName,
    naturally,
    unicode,
    hasNoMember,
    and,
    not,
    isAbsoluteModule,
    isRelativeModule,
  } = styleApi;

  const modules = readdirSync('./node_modules');

  const isFromNodeModules = imported => modules.indexOf(imported.moduleName.split('/')[0]) !== -1;
  const isReactModule = imported => Boolean(imported.moduleName.match(/^(react|prop-types|redux)/));
  const isStylesModule = imported => Boolean(imported.moduleName.match(/\.(s?css|less)$/));
  const isTypesModule = imported => Boolean(imported.moduleName.match(/types$/));

  const reactComparator = (name1, name2) => {
    let i1 = fixedOrder.indexOf(name1);
    let i2 = fixedOrder.indexOf(name2);

    i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
    i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;

    return i1 === i2 ? naturally(name1, name2) : i1 - i2;
  };

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule, not(isStylesModule), not(isTypesModule)) },
    { separator: true },

    // import React from "react";
    {
      match: isReactModule,
      sort: moduleName(reactComparator),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import uniq from 'lodash/uniq';
    {
      match: isFromNodeModules,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // Scoped modules (@-prefixed), sorted by module name.
    {
      match: isScopedModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import Component from "components/Component.jsx";
    {
      match: isAbsoluteModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, not(isStylesModule), not(isTypesModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import "./styles.css";
    { match: and(hasNoMember, isRelativeModule, isStylesModule) },

    // import styles from "./Components.scss";
    {
      match: isStylesModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import types from "./types";
    {
      match: isTypesModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    { separator: true },
  ];
}
