import {IStyleAPI, IStyleItem} from "import-sort-style";

export default function(styleApi: IStyleAPI): IStyleItem[] {

  const {
    alias,
    always,
    dotSegmentCount,
    isScopedModule,
    isNodeModule,
    moduleName,
    naturally,
    unicode,
    isInstalledModule,
    isAbsoluteModule,
    isRelativeModule
  } = styleApi;

  return [
    // Node packages, sorted by module name.
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
    // Installed NPM packages, sorted by module name.
    {
      match: isInstalledModule(__filename),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
    // Scoped modules (@-prefixed), sorted by module name.
    {
      match: isScopedModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
    // Absolute modules sorted by module name.
    {
      match: isAbsoluteModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
    // All relative imports sorted by dot count, then module name.
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
  ];
}
