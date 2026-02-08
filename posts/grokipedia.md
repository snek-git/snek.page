---
title: Elon Musk's Grok Launders Genocide Denial
date: 2026-02-09
description: How Elon's shitty AI-only editorial system gets gamed into platforming Armenian Genocide denial through persistence
---
# Elon Musk's Grok Launders Genocide Denial

I work with AI stuff daily. I'd heard about Grokipedia and checked it out.

Grokipedia is xAI's AI-generated encyclopedia. Elon Musk announced it as "a massive improvement over Wikipedia" and "a necessary step towards the xAI goal of understanding the Universe." Whatever that means.

![Elon Musk announcing Grokipedia](/img/grokipedia/announcement.jpg)

Grok writes the articles, Grok reviews user-submitted edits, Grok decides what stays and what goes. No human editors, no human oversight.

Being Armenian, my first search was obviously the Armenian Genocide. It was pretty grim.

## The Article

15,000 words, 226 citations, academic tone.  Full of AI slop of course, but whatever. Looks thorough. A thorough wet dream of any Turkish official.

The section header for the scholarly consensus is "Pro-Genocide Thesis." Not "the genocide." The "pro-genocide thesis." Right, moving on. 

[Justin McCarthy](https://en.wikipedia.org/wiki/Justin_McCarthy_(American_historian)) is cited as a mainstream historian offering reasonable alternative interpretations. What it doesn't mention is that he received the [Order of Merit from Turkey](https://en.wikipedia.org/wiki/Order_of_Merit_of_the_Republic_of_Turkey), sits on the board of the [Institute of Turkish Studies](https://en.wikipedia.org/wiki/Institute_of_Turkish_Studies), and the [International Association of Genocide Scholars](https://en.wikipedia.org/wiki/International_Association_of_Genocide_Scholars) (the professional body for this field) has [named him](https://genocidescholars.org/wp-content/uploads/2019/04/Scholars-Denying-Armenian-Genocide-.pdf) as someone who "willingly falsifies, distorts, and manipulates the evidence." The [Encyclopedia of Genocide](https://en.wikipedia.org/wiki/Encyclopedia_of_Genocide) calls his work "shoddy and desperate." The [Encyclopedia of Human Rights](https://global.oup.com/academic/product/encyclopedia-of-human-rights-9780195334029) calls it "unethical practice."

The Turkish Ministry of Foreign Affairs (mfa.gov.tr) is cited multiple times. Not to represent the Turkish government's position, but as if it was research, on par with all the other academic sources.

[Yusuf Halaçoğlu's](https://en.wikipedia.org/wiki/Yusuf_Hala%C3%A7o%C4%9Flu) (a famous genocide denier) estimate of 56,000 Armenian deaths made it into the casualty section, treated as just one of the sources to consider. For context, even Turkey's own government estimate is around 300,000. Every genocide studies institution puts the figure between 800,000 and 1.5 million. Halaçoğlu was president of the [Turkish Historical Society](https://en.wikipedia.org/wiki/Turkish_Historical_Society), a state institution.

## The Edit History

Grokipedia lets users suggest edits. Grok reviews them and accepts or rejects. No human in the loop. This is prime hunting ground for Mehmet from Berlin. 

The edit history shows a coordinated campaign. Same sources (McCarthy, Halaçoğlu, Turkish MFA documents), same strategy ("replace advocacy sources with neutral ones," where "neutral" means Turkish state publications), same edits resubmitted over and over with slightly tweaked wording.

Here's the thing: **the system correctly rejected an edit to insert McCarthy's framing into the introduction. Twice. It identified McCarthy as controversial and the edit as biased.**

![Rejected McCarthy edit](/img/grokipedia/edit4.jpg)

![Rejected McCarthy edit, second attempt](/img/grokipedia/edit2.jpg)

On the third submission with slightly adjusted wording, it approved it. Mehmet from Berlin has successfully prompt-injected Grok to manipulate the article about Armenian Genocide. 

![Approved McCarthy edit, same content, different wording](/img/grokipedia/edit3.jpg)

The AI understood the edit was harmful. It explained why. Then it changed its mind because someone rephrased the same thing. 

![Another approved edit, softening "assimilation" language](/img/grokipedia/edit1.jpg)

Halaçoğlu's 56,000 figure was rejected as denialist in other contexts. It made it into the casualty section anyway under "diversity of Turkish scholarly views."

The system caught the obvious stuff. Someone tried changing "inhabited" to "happened to live." Someone tried inserting fictional "7 feet tall female Turkish guards." But the sophisticated denial, the kind that uses academic language and cites real (if discredited) scholars, gets through if you just keep trying.

## The Actual Problem

An AI that can be talked out of its own rules by just trying enough times should not be running a public encyclopedia by itself.

This is Elon's alternative to Wikipedia. The pitch is that Wikipedia is ideologically biased and an AI would be more neutral. What "neutrality" means here is that a genocide [recognized by over 30 countries](https://en.wikipedia.org/wiki/Armenian_genocide_recognition), the US included, gets treated as one opinion among several. Grok treats the International Association of Genocide Scholars and the Turkish Ministry of Foreign Affairs as equivalent sources. When you point out that a scholar has been named as a denier by the field's own professional body, Grok calls it an "advocacy-oriented group."

The edit history proves that Mehmet from Berlin can game the system. Submit the same edit three times with different wording and the AI flips. The Armenian Genocide is the case I found because I'm Armenian. But any topic where a government cares about controlling the story has the same problem.

## Why It Matters

Nobody serious cites Grokipedia for research. That's not the point.

Grokipedia pages get indexed on Google. 226 citations and 15,000 words looks authoritative to scrapers and search engines. McCarthy's framing, the false equivalence, Halaçoğlu's 56,000 number. All of it ends up in search results and training data, presented as real scholarly debate.

Someone searching "Armenian Genocide casualties" could run into Halaçoğlu's 56,000 as a scholarly estimate. Search snippets don't tell you that number comes from a Turkish state institution head and has been rejected by every serious researcher in the field.

And it's not hard to predict that Grok will use Grokipedia as its own knowledge base, if it doesn't already. A lot of people use Grok. More than I'd like, but they do, and they treat what it says as correct. If the ground truth is skewed, so is every answer Grok gives based on it. And so is every opinion formed by someone who trusted that answer.

Nobody reads Grokipedia today. But the models trained on it will repeat it tomorrow.
