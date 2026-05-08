import activity from "@/assets/icons/activity.png";
import netflix from "@/assets/icons/netflix.png"
import add from "@/assets/icons/add.png";
import adobe from "@/assets/icons/adobe.png";
import back from "@/assets/icons/back.png";
import canva from "@/assets/icons/canva.png";
import claude from "@/assets/icons/claude.png";
import dropbox from "@/assets/icons/dropbox.png";
import figma from "@/assets/icons/figma.png";
import github from "@/assets/icons/github.png";
import home from "@/assets/icons/home.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import setting from "@/assets/icons/setting.png";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";
import alarm from "@/assets/icons/alarm.png";
import calndar from "@/assets/icons/clandar.png";
import google from "@/assets/icons/google.jpg";
import orbb from "@/assets/icons/orbblack.png";
import blackgo from "@/assets/icons/blackgo.jpg";
import youtube from "@/assets/icons/icons8-youtube-100.png";
import twiter from "@/assets/icons/icons8-twitter-bird-100.png";
import amazon from "@/assets/icons/icons8-amazon-100.png";
import facebook from "@/assets/icons/icons8-facebook-100.png";
import discord from "@/assets/icons/icons8-discord-new-100.png";
import windows from "@/assets/icons/icons8-windows-8-100.png";
import telegram from "@/assets/icons/icons8-telegram-100.png";
import idk from "@/assets/icons/idk.png";



export const icons = {
    home,
    wallet,
    setting,
    activity,
    add,
    back,
    menu,
    blackgo,
    plus,
    notion,
    dropbox,
    openai,
    adobe,
    medium,
    figma,
    spotify,
    github,
    claude,
    canva,
    alarm,
    calndar,
    google,
    netflix,
    orbb,
    youtube,
    twiter,
    amazon,
    facebook,
    discord,
    windows,
    telegram,
    idk
} as const;

export type IconKey = keyof typeof icons;