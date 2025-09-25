import slugify from 'slugify'

export const generateStoreCode = (storeName: string): string => {
  return slugify(storeName, {
    lower: true,
    strict: true,
    locale: 'vi',
    remove: /[*+~.()'"!:@]/g
  }).replace(/-/g, '')
}
