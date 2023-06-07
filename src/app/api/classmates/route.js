import path from "path";
import { promises as fs } from 'fs';
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "src/app/json/classmates/classmates.json");

function formatID(id) {
    return id ? id.toString().padStart(3, "0") : "";
}

export function isValidID(id) {
    if(Number.isInteger(parseInt(id, 10))) {
        return true;
    }

    return false;
}

export async function fetchJSONData(id) {
    if(!isValidID(id)) {
        return null;
    }
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data)[id.toString()];
}

async function fetchArticleList() {
    const articles = [];
    let counter = 1;
    
    while(true) {
        try {
            const article = await fetchJSONData(counter);
            const data = JSON.parse(article);
            const arr = [data.title,
                         data.subtitle,
                         data.author,
                         data.description];
            articles.push(arr);
            counter++;
        } catch(error) {
            console.error(error);
            break;
        }
    }

    return JSON.stringify(articles);
}

export async function GET(request) {
    const data = await fetchArticleList();
    return NextResponse.json(JSON.parse(data));
}