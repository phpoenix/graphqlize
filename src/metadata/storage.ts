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
  ownFields: string[]
}

type TInterfaceDefinitionsMap = {
  [interfaceName: string]: TInterfaceDefinition
}

class MetaStorage {
  private query: TTypeDefinition = {
    name: 'Query',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}
  private interfaces: TInterfaceDefinitionsMap = {}

  public addQueryDefinition(name: string, type: string) {
    this.query.fields[name] = {
      type,
    }
  }

  public createTypeDefinition(constructorFn: any, options) {
    const name: string = options?.name || constructorFn.name

    const { __fieldsMap } = new constructorFn()

    this.types[name] = {
      name,
      fields: __fieldsMap,
      interfaces: options?.interfaces?.map(item => ({ type: item.name })),
    }
  }

  public createInterfaceDefinition(constructorFn: any) {
    const name: string = constructorFn.name

    const { __fieldsMap } = new constructorFn()

    this.interfaces[name] = {
      name,
      fields: __fieldsMap,
      ownFields: Object.keys(__fieldsMap),
    }
  }

  public getEntities() {
    return {
      query: this.query,
      types: this.types,
      interfaces: this.interfaces,
    }
  }
}

export const storage = new MetaStorage()
