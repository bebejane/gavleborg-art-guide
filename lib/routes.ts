type Routes = {
  [key: string]: Route
}

type Route = {
  path: ((item?: any) => string[] | null)
  typeName: string
}

const routes: Routes = {
  "program": {
    typeName: "ProgramRecord",
    path: (item) => [`/${item.slug}`, '/']
  },
  "program_category": {
    typeName: "ProgramCategoryRecord",
    path: (item) => ['/']
  },
  "location": {
    typeName: "LocationRecord",
    path: (item) => ['/']
  },
  "partner": {
    typeName: "PartnerRecord",
    path: (item) => ['/']
  },
  "general": {
    typeName: "GeneralRecord",
    path: (item) => ['/']
  },
  "in_english": {
    typeName: "InEnglishRecord",
    path: (item) => ['/english']
  }
}

export const buildRoute = (model: string, item?: any): string[] | null => {
  if (!routes[model]) throw new Error(`Invalid model: ${model}`)
  return routes[model].path(item)
}

export const recordToRoute = (record: any): string[] => {
  const { __typename } = record
  const model = Object.keys(routes).find(key => routes[key].typeName === __typename)
  if (!model) throw new Error(`Invalid record: ${__typename}`)
  return buildRoute(model, record)
}

export default routes