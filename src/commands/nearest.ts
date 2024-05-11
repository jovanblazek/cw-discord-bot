import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create/web'

type NearestResponse = {
  result: {
    td: string[]
  }
}

export default class NearestCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'nearest',
      description: 'Gets a nearest system with xyz',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'system',
          description: 'System name',
          required: true
        }
      ]
    })
  }

  async run(ctx: CommandContext) {
    ctx.defer(true)
    const systemUrlEncoded = encodeURIComponent(ctx.options.system)
    const encodedUrl = encodeURIComponent(
      `https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=${systemUrlEncoded}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=3&pi19=0&pi17=0&pa1%5B%5D=25&ps2=&pi25=0&pi8=&pi9=0&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0`
    )
    const tableCells = await fetch(
      `https://web.scraper.workers.dev/?url=${encodedUrl}&selector=td&scrape=text&pretty=true`
    ).then((res) => res.json<NearestResponse>())

    // chunk the array into arrays of 8
    const chunked = tableCells.result.td.reduce((resultArray: string[][], item, index) => {
      const chunkIndex = Math.floor(index / 8)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])

    const data = chunked
      .map((row) => ({
        type: row[0],
        station: row[1],
        system: row[2].slice(0, -2), // remove copy icon
        distanceLs: row[6],
        distanceLy: row[7].slice(0, -2)
      }))
      .slice(0, 10)

    return ctx.send({
      embeds: [
        {
          title: `Nearest stations to ${ctx.options.system}`,
          description:
            "I'm a bot that finds the nearest stations to a system. I'm not very good at it, but I try my best.",
          fields: data.map(({ type, station, distanceLs, distanceLy, system }) => ({
            name: `${type ? `${type} - ` : ''}${system}`,
            value: `${station} - ${distanceLs}\n\`${distanceLy}\`\n`
          }))
        }
      ]
    })
  }
}
