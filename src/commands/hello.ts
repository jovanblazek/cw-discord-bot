import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create/web'

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'food',
          description: 'What food do you like?'
        }
      ]
    })
  }

  async run(ctx: CommandContext) {
    return ctx.send({
      embeds: [
        {
          title: ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Hello, ${ctx.user.username}!`,
          description: "I'm a bot that says hello to you. I'm not very good at it, but I try my best."
        }
      ]
    })
  }
}
