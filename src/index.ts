import { IStyleAPI, IStyleItem } from 'import-sort-style';

import {
  isFromNodeModules,
  isReactModule,
  isStylesModule,
  isTypesModule,
  isConstantsModule,
  isUtilsModule,
  isNotSpecial,
  reactComparator,
} from './utils';

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const { alias, dotSegmentCount, isScopedModule, isNodeModule, moduleName, naturally } = styleApi;
  const { unicode, hasNoMember, and, isAbsoluteModule, isRelativeModule } = styleApi;

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    {
      match: and(hasNoMember, isRelativeModule, isNotSpecial),
    },
    { separator: true },

    // import React from "react";
    {
      match: isReactModule,
      sort: moduleName(reactComparator(naturally)),
      sortNamedMembers: alias(unicode),
    },

    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },

    // import uniq from 'lodash/uniq';
    {
      match: isFromNodeModules,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // Scoped modules (@-prefixed), sorted by module name.
    {
      match: and(isScopedModule, isNotSpecial),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import Component from "components/Component.jsx";
    {
      match: and(isAbsoluteModule, isNotSpecial),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, isNotSpecial),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import utils from 'utils'
    {
      match: and(isUtilsModule, isAbsoluteModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    // import utils from './utils'
    {
      match: and(isUtilsModule, isRelativeModule),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import { ABC } from 'constants'
    {
      match: and(isConstantsModule, isAbsoluteModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    // import { ABC } from './constants'
    {
      match: and(isConstantsModule, isRelativeModule),
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
