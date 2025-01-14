import { WASticker } from "../../libs/convert"
import config from "../../utils/config"
import type { Command } from "../../types/command"

const wasticker = new WASticker({
  pack: config.name,
  author: config.footer,
  categories: ["👋"]
})

export default <Command>{
  category: "convert",
  cd: 10,
  desc: "Create sticker from photo or video!",
  example: `
  Send a image/video message with caption
  @PREFIX@CMD
  --------
  or Reply a image/video message with text
  @PREFIX@CMD
  --------
  `,
  execute: async ({ aruga, message }) => {
    if (message.type.includes("image") || (message.quoted && message.quoted.type.includes("image"))) {
      const buffer = message.quoted ? await aruga.downloadMediaMessage(message.quoted.message) : await aruga.downloadMediaMessage(message.message)
      const result = await wasticker.ConvertMedia(buffer, "image")

      return await aruga.sendMessage(message.from, { sticker: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }

    if (message.type.includes("video") || (message.quoted && message.quoted.type.includes("video"))) {
      const duration = message.quoted
        ? (message.quoted.message[message.quoted.type].seconds as number)
        : (message.message[message.type].seconds as number)
      if (duration && !isNaN(duration) && duration > 10) throw "Video duration is too long! Maximum duration of 10 seconds"

      const buffer = message.quoted ? await aruga.downloadMediaMessage(message.quoted.message) : await aruga.downloadMediaMessage(message.message)
      const result = await wasticker.ConvertMedia(buffer, "video")

      return await aruga.sendMessage(message.from, { sticker: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }

    throw "noCmd"
  }
}
