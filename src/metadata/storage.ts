type TFieldDefinition = {
  type: string | [string]
}

type TFieldDefinitionsMap = {
  [fieldName: string]: TFieldDefinition
}

type TTypeDefinition = {
  name: string
  fields: TFieldDefinitionsMap
  interfaces?: string[]
}

type TTypeDefinitionsMap = {
  [typeName: string]: TTypeDefinition
}

type TInterfaceDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

type TInterfaceDefinitionsMap = {
  [interfaceName: string]: TInterfaceDefinition
}

type TUnionDefinition = {
  name: string
  types: string[]
}

type TUnionDefinitionsMap = {
  [unionName: string]: TUnionDefinition
}

class MetaStorage {
  private query: TTypeDefinition = {
    name: 'Query',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}
  private interfaces: TInterfaceDefinitionsMap = {}
  private unions: TUnionDefinitionsMap = {}

  public addQueryDefinition(name: string, type: string) {
    this.query.fields[name] = {
      type,
    }
  }

  public createTypeDefinition(constructorFn: any, options, parentConstructor?: any) {
    const name: string = options?.name || constructorFn.name

    const { __fieldsMap } = new constructorFn()

    this.types[name] = {
      name,
      fields: { ...__fieldsMap[parentConstructor.name], ...__fieldsMap[name] },
      interfaces: options?.interfaces?.map(item => ({ type: item.name })),
    }
  }

  public createInterfaceDefinition(constructorFn: any) {
    const name: string = constructorFn.name

    const { __fieldsMap } = new constructorFn()

    this.interfaces[name] = {
      name,
      fields: __fieldsMap[name],
    }
  }

  public createUnionDefinition(constructorFn: any, options) {
    const name: string = options.name || constructorFn.name

    this.unions[name] = {
      name,
      types: options.types.map(type => type.name),
    }
  }

  public getEntities() {
    return {
      query: this.query,
      types: this.types,
      interfaces: this.interfaces,
      unions: this.unions,
    }
  }
}

export const storage = new MetaStorage()
