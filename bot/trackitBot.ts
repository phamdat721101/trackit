import { Bot, InlineKeyboard, CommandContext, Context } from "grammy";

// Create a bot object
const bot = new Bot(""); // <-- place your bot token in this string

// Main bot logic
async function main() {
    bot.api.setMyCommands([
        { command: "start", description: "Start Trackit Bot" },
        { command: "add", description: "Add [address] into watchlist" },
        { command: "remove", description: "Remove [address] from watchlist" },
    ]);

    bot.command('start', (ctx: CommandContext<Context>) => {
        ctx.reply("Welcome to Trackit");
    })


    // Start the bot
    await bot.start();
}

// Run the bot
main().catch(error => {
    console.error("Bot error:", error);
});