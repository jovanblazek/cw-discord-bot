import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create/web'

type ProductsResponse = {
  products: {
    id: number
    title: string
    description: string
    price: number
  }[]
}

export default class ProductCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'product',
      description: 'Gets a product by category',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'category',
          description: 'Product category',
          required: true,
          choices: [
            {
              name: 'smartphones',
              value: 'smartphones'
            },
            {
              name: 'laptops',
              value: 'laptops'
            },
            {
              name: 'fragrances',
              value: 'fragrances'
            },
            {
              name: 'skincare',
              value: 'skincare'
            },
            {
              name: 'groceries',
              value: 'groceries'
            },
            {
              name: 'home-decoration',
              value: 'home-decoration'
            },
            {
              name: 'furniture',
              value: 'furniture'
            },
            {
              name: 'tops',
              value: 'tops'
            },
            {
              name: 'womens-dresses',
              value: 'womens-dresses'
            },
            {
              name: 'womens-shoes',
              value: 'womens-shoes'
            },
            {
              name: 'mens-shirts',
              value: 'mens-shirts'
            },
            {
              name: 'mens-shoes',
              value: 'mens-shoes'
            },
            {
              name: 'mens-watches',
              value: 'mens-watches'
            },
            {
              name: 'womens-watches',
              value: 'womens-watches'
            },
            {
              name: 'womens-bags',
              value: 'womens-bags'
            },
            {
              name: 'womens-jewellery',
              value: 'womens-jewellery'
            },
            {
              name: 'sunglasses',
              value: 'sunglasses'
            },
            {
              name: 'automotive',
              value: 'automotive'
            },
            {
              name: 'motorcycle',
              value: 'motorcycle'
            },
            {
              name: 'lighting',
              value: 'lighting'
            }
          ]
        }
      ]
    })
  }

  async run(ctx: CommandContext) {
    ctx.defer(true)
    const products = await fetch(`https://dummyjson.com/products/category/${ctx.options.category}`).then((res) =>
      res.json<ProductsResponse>()
    )
    return ctx.send({
      embeds: [
        {
          title: `You selected ${ctx.options.category}`,
          description: "Here's a list of products in that category:",
          fields: products.products.map((product) => ({
            name: product.title,
            value: `Price: $${product.price}`
          }))
        }
      ]
    })
  }
}
