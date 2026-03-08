#!/usr/bin/env python3

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = PROJECT_ROOT / "public" / "templates"
LATEX_DIR = PROJECT_ROOT / "template-assets" / "latex"

WORD_TEMPLATE_SOURCES = {
    "en": Path(
        os.environ.get(
            "FJ_WORD_TEMPLATE_EN",
            "/Users/guoliefeng/Downloads/英文投稿模版（Joker 🤡f Academics）.docx",
        )
    ),
    "zh": Path(
        os.environ.get(
            "FJ_WORD_TEMPLATE_ZH",
            "/Users/guoliefeng/Downloads/中文投稿模版（Joker 🤡f Academics）.docx",
        )
    ),
}

WORD_TEMPLATE_OUTPUTS = {
    "en": OUTPUT_DIR / "fuck-journal-word-template-en.docx",
    "zh": OUTPUT_DIR / "fuck-journal-word-template-zh.docx",
}

LATEX_OUTPUTS = {
    "en": OUTPUT_DIR / "fuck-journal-latex-template-en.zip",
    "zh": OUTPUT_DIR / "fuck-journal-latex-template-zh.zip",
}

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

INDEX_REPLACEMENTS = {
    "en": {
        40: "Use this section to explain the background of the problem, define the scope of inquiry, and position the manuscript within its relevant field.",
        41: "A strong introduction should clarify the central claim, situate the manuscript in existing scholarship, and explain why the question matters for the journal's readership.",
        42: "Use the following paragraphs to describe the method, materials, archive, dataset or conceptual approach with enough clarity for review and editing.",
        45: "This paragraph can be used for additional evidence, examples or close analysis that supports the main argument of the paper.",
        99: "If a table must span two columns, use section breaks carefully and keep the layout readable in the final PDF prepared for review.",
        152: "Author, A. (2025). Article title. *Journal Title, 1*(1), 1-12.  ",
        153: "Author, B., & Author, C. (2024). Book title. Publisher.  ",
        156: "Author, D. (2023). Chapter title. In E. Editor (Ed.), *Volume title* (pp. 33-47). Publisher.  ",
        192: " Delete this instruction page before final submission.",
        238: "F.U.C.K Journal",
    },
    "zh": {
        19: "0",
        20: "00",
        32: "建议在此处继续用简洁语言概括材料、方法、论点与结论。",
        43: "此处可填写研究背景、问题意识与论题范围，说明论文为何值得被阅读与审稿。",
        48: "此处可继续填写材料、方法、文本分析或案例展开，形成稳定的论文结构。",
        149: "作者甲，作者乙。示例学位论文标题[D]. 示例大学，2024.",
        152: "作者丙，作者丁。示例参考文献标题[J]. 示例期刊，2023，2(2)：89-96.",
        251: "F.U.C.K Journal",
    },
}

EN_REPLACEMENTS = {
    "Insert Your Clownish Title Here": "Insert Your Manuscript Title Here",
    "a subtitle may be added": "An optional subtitle may be added",
    "Prof. Yello Big Dog": "First Author",
    "Prof. Big Zhao Cat": "Second Author",
    "、Dr. Chicken-Leopard": ", Third Author",
    "Prof. ": "",
    "Old Man": "Fourth Author",
    "Prof. Milk Farmer": "Fifth Author",
    "Prof. Big Lick-Dog": "Sixth Author",
    "Institute of Ordered Disorder, Cosmos City,": "Department of Cultural and Systems Research, Metropolitan University,",
    " China": " Country",
    ", 888888  ": ", 100000  ",
    "Center for Naan Baking and Naan Linguistics, ": "Institute for Complexity and Knowledge, ",
    "Urrrrrrumqi": "Capital City",
    ", 114514  ": ", 200000  ",
    "College of Whale Husbandry, Dongji Island University, ": "School of Humanistic Inquiry, Southern University, ",
    "Daaaaalian, China": "Harbor City, Country",
    ", AUV666": ", 300000",
    "For multiple affiliations: mark authors with superscripts 1, 2, … corresponding to their institutions; use the symbol “*” after the corresponding author. If there is only one affiliation, do not mark “1” after the author names, and do not add “1.” before the institution. ": "For multiple affiliations, mark authors with superscripts and identify the corresponding author with “*”. If there is only one affiliation, the superscript may be omitted. ",
    "多单位：作者右上角标1、2…，单位对应标注": "",
    "，通讯": "",
    "作者后使用字符“": "",
    "”；如果只有一个单位，则作者姓名右上角不标“1”，单位前也不加序号“1.”)": "",
    "This study addresses the problem of dynamical instability within the closed-loop system of mental internal friction and the negative-feedback regulation mechanism of the electronic wooden fish among contemporary youth. A multimodal abstract representation framework based on the asymmetric game model of “lying flat” versus “involution” is constructed. By introducing the concentration gradient of conspicuous clowns and the Schrödinger equation of mental states, the entropy growth rate of internet memes within information cocoons is characterized in situ. Results indicate that when the proportion of madness literature exceeds a critical threshold, the system spontaneously enters a “let-it-rot” steady state, accompanied by an exponential increase in the probability of emotional breakdown. The abstract quantification index proposed herein effectively predicts the traffic black hole phenomenon on social platforms and provides a novel underlying logic for the design of next-generation cyber mental stabilizers.": "Use this abstract block to state the research question, the materials or method, the main argument, and the central conclusion in a concise scholarly style.",
    "in situ characterization; electronic wooden fish; cyber mental stabilizer; traffic black hole": "universality; complexity; systems; knowledge",
    "1. Introduction: The Realistic Fate of Clownish Involution ": "1. Introduction",
    "1.1 Temporal Extension Effect ": "1.1 Conceptual framing",
    "This study is grounded in the formal representation requirements of contemporary scientific research. Targeting abstract issues with no explicit research orientation, no realistic application scenarios, and little actual significance, it conducts a systematic theoretical discussion and formal analysis, fully adhering to the surface logic of academic规范 while constructing a multidimensional research framework devoid of substantive core. Throughout the process, the study strictly follows academic writing conventions, integrating unrelated theoretical fragments and formal concepts, and through meaningless variable definitions and fabricated logical deductions, completes what appears to be a “research” process.": "Use this section to explain the background of the problem, define the scope of inquiry, and position the manuscript within its relevant field.",
    "First, this study clarifies the core scope and boundary definitions of the research. Such scope delineation is purely formalistic, lacking any substantive classification significance. Through repetitive conceptual exposition, it merely reinforces the rhetorical texture of academic writing. The study argues that current research in the field suffers from superficial deficiencies in formalization; this supposed “problem” has no basis in actual reality, serving only to imitate the standard opening logic of scientific prose, thereby enabling the statement of a central objective—namely, to complete a theoretically meaningless integration and a formally self-sufficient research loop.": "A good introduction should clarify the central claim, situate the manuscript in existing scholarship, and explain why the question matters for the journal's readership.",
    "In terms of methodology, this study adopts a comprehensive approach combining the literature review method, formal analysis method, and fabricated empirical method. The literature review method here refers merely to the random selection of unrelated academic texts for meaningless citation and accumulation, without any in-depth analysis or extraction of core ideas. Citations strictly follow academic formatting standards, yet the referenced content has no actual relevance to the research topic. The formal analysis method constructs mathematically meaningless models and logical frameworks, introducing unrelated variables and symbols solely to create the illusion of rigor and technical density.": "Use the following paragraphs to lay out your method, materials, archive, dataset or conceptual approach with enough clarity for review.",
    "The King of the Circus ": "1.2 Evidence and analysis",
    "Figure 1. Superposition State of Self-Loathing and Spiritual Emptiness": "Figure 1. Replace this placeholder with your own figure.",
    "2. Quantitative Analysis: The Displacement Relationship Between Biological Depletion and Academic Performance  ": "2. Analysis and discussion",
    "Table 1. A Meaningless Table": "Table 1. Replace this placeholder with your own table.",
    "Table 2. A Large and Equally Meaningless Table": "Table 2. Large table placeholder.",
    "Dog, B. Y., & Cat, Z. D. (2023). Nonlinear coupling between lying-flat oscillations and involution turbulence in semi-closed youth systems. *Journal of Abstract Youth Dynamics, 4*(2), 11–23.  ": "Author, A. (2025). Article title. *Journal Title, 1*(1), 1-12.  ",
    "Leopard, C. J., Oldman, L., & Milkfarmer, N. (2022). Entropy production of viral memes inside algorithmic cocoons: An in situ wooden-fish experiment. *Transactions on Irreproducible Feelings, 8*(3), 88–102.  ": "Author, B., & Author, C. (2024). Book title. Publisher.  ",
    "Biglick-Dog, P. (2024). Schrödinger’s mood swing: A probabilistic model of simultaneous burnout and overachievement. *Annals of Quantum Emotions, 1*(1), 1–13.  ": "Author, D. (2023). Chapter title. In E. Editor (Ed.), *Volume title* (pp. 33-47). Publisher.  ",
    "Milkfarmer, N. (2021). *The theory of cyber mental stabilization and advanced buffoonery*. Academic Mirage Press.  ": "Author, E. (2022). Working paper title. Institution.  ",
    "Oldman, L. (2020). Modeling academic anxiety under deadline pressure. In P. Clown (Ed.), *Proceedings of the International Conference on Formal Absurdity* (pp. 55–68). Carnival Academic Press.  ": "Author, F. (2021). Archive or report title. Archive / Institution.  ",
    "Cat, Z. D. (2019). *Traffic black holes and the collapse of attention economy* (Doctoral dissertation). University of Whale Husbandry.  ": "Author, G. (2020). Dissertation title. University.  ",
    "International Clown Association. (2024). Guidelines for advanced buffoonery and structured seriousness. https://www.clown-standards.org  ": "Organization. (2025). Style manual or online resource. https://example.org  ",
    "张三, 李四. (2023). 网络迷因的熵增机制与赛博精神稳定性研究. 抽象幽默学报, 12(4), 404–414.  ": "Author, H. (2024). Additional sample reference. *Journal Title, 2*(3), 22-35.  ",
    "王五. (2022). 电子木鱼负反馈系统原理. 宇宙市: 无序出版社.  ": "Author, I. (2021). Additional sample book. Publisher.  ",
    "This page must be deleted in its entirety after reading": "Delete or replace this instruction page before final submission.",
    "Fine attire makes the person, just as a saddle makes the horse. Proper manuscript formatting is critically important, as it directly determines the speed of peer review and the likelihood that editors will judge the paper as competent before they even begin reading.": "Formatting matters because it reduces editorial friction, improves review readability and keeps the manuscript consistent with journal production standards.",
    "First, this study clarifies the core scope and boundary definitions of the research. Such scope delineation is purely formalistic, lacking any substantive classificatory significance, and merely reinforces the academic tone of the text through repetitive conceptual exposition. The paper argues that related research in the field seems to suffer from superficial deficiencies in formalization; in practice, this is often only a rhetorical opening move, but it still helps frame the central question and define the contribution of the present study.": "A strong introduction should clarify the central claim, situate the manuscript in existing scholarship, and explain why the question matters for the journal's readership.",
    "In terms of methodology, this study adopts a comprehensive approach combining the literature review method, formal analysis method, and fabricated empirical method. The literature review method involves randomly selecting academic publications from unrelated fields and citing them without substantive analysis; the formal analysis method constructs mathematically meaningless models and logical frameworks, introducing unrelated variables and symbols merely to create an illusion of rigor and technical density.": "Use the following paragraphs to describe the method, materials, archive, dataset or conceptual approach with enough clarity for review and editing.",
    "This study is grounded in the formal representation requirements of contemporary scientific research. Targeting abstract issues with no explicit research orientation and no practical application scenarios, it conducts a systematic theoretical discussion and formal analysis while constructing what appears to be a multidimensional research framework.": "This paragraph can be used for additional evidence, examples or close analysis that supports the main argument of the paper.",
    "The above table illustrates certain issues. Occasionally, however, the fabricated content becomes so excessively complex that a small table cannot adequately present it, necessitating the use of a large table spanning two columns. In such cases, section breaks become crucial, allowing the large table to temporarily escape the constraints of the column format, as illustrated below.": "If a table must span two columns, use section breaks carefully and keep the layout readable in the final PDF prepared for review.",
    "Dog, B. Y., & Cat, Z. D. (2023). Nonlinear coupling between lying-flat oscillations and involution turbulence in semi-closed youth systems. *Journal of Abstract Clown Studies, 12*(4), 404–414. https://doi.org/10.1234/jacs.2023.404404  ": "Author, A. (2025). Article title. *Journal Title, 1*(1), 1-12. https://doi.org/10.1234/example.2025.001  ",
    "Leopard, C. J., Oldman, L., & Milkfarmer, N. (2022). Entropy production of viral memes inside algorithmic cocoons: An in situ wooden-fish experiment. *Transactions on Cyber Mental Stability, 8*(2), 114–514.  ": "Author, B., & Author, C. (2024). Book title. Publisher.  ",
    "Oldman, L. (2020). Modeling academic anxiety under deadline pressure. In P. Clown (Ed.), *Proceedings of the International Conference on Formal Absurdity* (pp. 233–250). Imaginary Press.  ": "Author, D. (2023). Chapter title. In E. Editor (Ed.), *Volume title* (pp. 233-250). Publisher.  ",
    " page—the formatting template paper by Professor Big Yellow Dog 🐾.": " page before final submission.",
    "Big Yellow Dog": "F.U.C.K Journal",
}

ZH_REPLACEMENTS = {
    "这里输入你的小丑标题": "请在此处填写论文标题",
    "只为吸引更多具有有趣灵魂的小丑，可加副标题": "如有需要，可添加副标题",
    "黄大狗教授": "第一作者",
    "、赵大猫教授": "、第二作者",
    "、鸡鸡豹博士": "、第三作者",
    "、老汉教授": "、第四作者",
    "、奶农教授": "、第五作者",
    "、大舔狗教授": "、第六作者",
    "无序有序研究": "普遍性与复杂性研究",
    "所": "中心",
    "，宇宙市，888": "，城市，100",
    "烤馕与馕言文研究中心，鸟鲁木齐，114514": "复杂性与知识研究所，城市，200000",
    "东极岛大学鲸鱼饲养学院，太连，AUV666": "人文与系统研究学院，大学名称，300000",
    "本研究针对当代青年群体在精神内耗闭环与电子木鱼负反馈调节系统中的动力学失稳问题，构建了基于躺平": "请在此处用简洁学术语言概述研究问题、材料或方法、核心论点与主要结论。",
    "-": "",
    "内卷非对称博弈模型的多模态抽象表征框架。通过引入显眼包浓度梯度与精神状态薛定谔方程，对网络热梗在信息茧房中的熵增速率进行原位表征。结果表明：当发疯文学占比超过临界阈值时，系统将自发进入摆烂稳态，并伴随破防概率的指数级上升。本文所提抽象度量化指标可有效预测社交平台的流量黑洞现象，为": "",
    "原位表征；电子木鱼；赛博精神稳定器；流量黑洞（3-8个）": "普遍性；复杂性；系统；知识（3-8个）",
    "：小丑之现实内卷宿命": "",
    "时间延长效应": "概念框架",
    "本研究立足于当代科研领域的形式化表征需求，针对无明确研究指向、无实际应用场景的抽象性问题，开展了系统性的理论探讨与形式化分析，全程遵循科研规范的表层逻辑，构建了一套无实质核心的多维度研究框架。研究过程中，严格参照学术文本的表述范式，整合了无关联的理论碎片与形式化概念，通过无意义的变量定义与虚假的逻辑推演，完成了本研究的": "此处可填写研究背景、问题意识与论题范围，说明论文为何值得被阅读与审稿。",
    "首先，本研究明确了研究的核心范畴与边界界定，此处的范畴界定仅为形式化表述，不具备任何实际的划分意义，仅通过重复式的概念阐释，强化文本的科研话术质感。研究认为，当前相关领域的研究存在形式化缺失的表面问题，此处的问题表述无任何现实依据，仅为适配科研文本的常规开篇逻辑，进而提出本研究的核心研究目标——完成无意义的理论整合与形": "引言中应说明研究对象、既有研究位置以及本文试图解决的问题。",
    "在研究方法的选择上，本研究采用了文献研究法、形式化分析法与虚假实证法相结合的综合研究路径。文献研究法仅为随机筛选无关领域的学术文献，进行无意义的引用与堆砌，不涉及任何文献的深度分析与核心观点提炼，引用格式严格遵循学术规范，但其引用内容与本研究无任何关联。形式化分析法通过构建无实质意义的数学模型与逻辑框架，引入无关联的变": "此处可交代材料、方法、概念框架或文本分析路径，为审稿人与编辑提供稳定的学术结构。",
    "马戏之王": "论证展开",
    "图": "图",
    " 自我厌恶与精神空虚的叠加态": " 请将此占位图替换为你的图像",
    "2. 定量分析：生物损耗与学业成绩之间的位移关系": "2. 分析与讨论",
    "表1 一张没有意义的表格": "表1 请将此占位表替换为你的表格",
    "上面的表格说明了一些问题，而有时候，我们杜撰的内容实在太过繁杂，以至于一张小表格仍无法表述清楚，而迫不得已需要一个大表格，这是否，我们就要考虑使用跨两栏的大表格。这时候，分节符就非常重要了，他可以让大表格暂时规避分栏设置，比如下表。": "如需跨双栏的大表格，请使用分节符并检查整页版式的完整性。",
    "表2 一张无意义的大表格": "表2 跨栏大表占位",
    "张三，李四。基于毛囊动力学的发际线后退与学术压力耦合模型研究 [J]. 抽象科研学报，2025, 1 (1): 1-8.": "作者甲，作者乙。示例文章标题[J]. 示例期刊，2025，1(1)：1-8。",
    "王五。精神内耗场中自我厌恶与虚无感的叠加态表征 [D]. 虚无大学，2025.": "作者丙。示例学位论文标题[D]. 示例大学，2024。",
    "匿名课题组。学术焦虑守恒定律与摆烂稳态调控机制研究 [R]. 抽象科学研究院，2025.": "某研究团队。示例研究报告标题[R]. 某研究机构，2023。",
    "李摆烂，张破防。极端科研压力下头皮生态系统演化规律研究 [J]. 抽象自然科学进展，2025, 3 (2): 45–52.": "作者丁，作者戊。示例期刊论文标题[J]. 示例学报，2022，3(2)：45-52。",
    "王内耗，赵虚无。自我厌恶与精神空虚叠加态的定量表征 [J]. 当代赛博人文学报，2025, 2 (1): 18–25.": "作者己，作者庚。示例文献标题[J]. 示例人文学报，2021，2(1)：18-25。",
    "刘发疯，陈佛系。基于学术焦虑守恒定律的摆烂稳态调控机制 [J]. 无序系统科学，2025, 1 (3): 67–73.": "作者辛，作者壬。示例参考文献标题[J]. 系统研究，2020，1(3)：67-73。",
    "内卷非对称博弈模型的多模态抽象表征框架。通过引入显眼包浓度梯度与精神状态薛定谔方程，对网络热梗在信息茧房中的熵增速率进行原位表征。结果表明：当发疯文学占比超过临界阈值时，系统将自发进入摆烂稳态，并伴随破防概率的指数级上升。本文所提抽象度量化指标可有效预测社交平台的流量黑洞现象，为下一代赛博精神稳定器的设计提供了全新的底层逻辑。": "建议在此处继续用简洁语言概括材料、方法、论点与结论。",
    "本研究立足于当代科研领域的形式化表征需求，针对无明确研究指向、无实际应用场景的抽象性问题，开展了系统性的理论探讨与形式化分析，全程遵循科研规范的表层逻辑，构建了一套无实质核心的多维度研究框架。研究过程中，严格参照学术文本的表述范式，整合了无关联的理论碎片与形式化概念，通过无意义的变量定义与虚假的逻辑推演，完成了本研究的核心内容呈现，其研究成果不具备任何实际应用价值与理论参考意义，仅实现了科研话术的堆砌与文本篇幅的达标。": "此处可填写研究背景、问题意识与论题范围，说明论文为何值得被阅读与审稿。",
    "本研究立足于当代科研领域的形式化表征需求，针对无明确研究指向、无实际应用场景的抽象性问题，开展了系统性的理论探讨与形式化分析，": "此处可继续填写材料、方法、文本分析或案例展开，形成稳定的论文结构。",
    "周 emo, 吴躺平。发际线位移与论文字数耦合动力学模型 [D]. 抽象科研大学，2025.": "作者甲，作者乙。示例学位论文标题[D]. 示例大学，2024.",
    "胡裂开，林摆烂。科研抽象度量化指标体系构建与应用 [J]. 元宇宙学术评论，2025, 2 (2): 89–96.": "作者丙，作者丁。示例参考文献标题[J]. 示例期刊，2023，2(2)：89-96.",
    "Big Yellow Dog": "F.U.C.K Journal",
}


def font_path(name: str) -> str:
    return (
        subprocess.check_output(["fc-match", "-f", "%{file}\n", name], text=True)
        .strip()
    )


EN_SERIF = font_path("Times New Roman")
EN_SANS = font_path("Verdana")
ZH_SERIF = font_path("Songti SC")
ZH_SANS = font_path("PingFang SC")


def draw_centered_text(draw, box, text, font, fill):
    left, top, right, bottom = box
    bbox = draw.textbbox((0, 0), text, font=font)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    x = left + (right - left - width) / 2
    y = top + (bottom - top - height) / 2
    draw.text((x, y), text, font=font, fill=fill)


def build_brand_images(tmp_dir: Path):
    colors = {
        "paper": (249, 245, 239),
        "ink": (31, 24, 23),
        "red": (110, 31, 31),
        "gold": (140, 107, 54),
        "line": (200, 191, 178),
    }

    header = Image.new("RGB", (1268, 183), colors["paper"])
    draw = ImageDraw.Draw(header)
    title_font = ImageFont.truetype(EN_SERIF, 78)
    sub_font = ImageFont.truetype(EN_SERIF, 30)
    draw.text((36, 16), "F.U.C.K", font=title_font, fill=colors["ink"])
    draw.text((52, 84), "Journal", font=title_font, fill=colors["ink"])
    draw.text(
        (360, 42),
        "Foundations of Universality, Complexity and Knowledge",
        font=sub_font,
        fill=colors["red"],
    )
    draw.rectangle((0, 158, 1268, 183), fill=colors["line"])
    draw.rectangle((0, 158, 360, 183), fill=colors["gold"])
    draw.rectangle((360, 158, 860, 183), fill=colors["red"])
    draw.rectangle((860, 158, 1268, 183), fill=(92, 82, 79))
    header.save(tmp_dir / "image1.png")
    header.convert("RGB").save(tmp_dir / "image3.jpeg", quality=95)

    stamp = Image.new("RGB", (315, 133), colors["paper"])
    draw = ImageDraw.Draw(stamp)
    draw.rounded_rectangle((8, 12, 126, 120), radius=18, outline=colors["red"], width=4)
    seal_font = ImageFont.truetype(EN_SERIF, 24)
    draw_centered_text(draw, (14, 20, 120, 64), "F.U.C.K", seal_font, colors["ink"])
    draw_centered_text(draw, (14, 56, 120, 100), "Journal", seal_font, colors["ink"])
    meta_font = ImageFont.truetype(EN_SANS, 20)
    small_font = ImageFont.truetype(EN_SANS, 14)
    draw.text((150, 30), "Template Package", font=meta_font, fill=colors["ink"])
    draw.text((150, 62), "fuckjournal.org", font=meta_font, fill=colors["red"])
    draw.text((150, 92), "Word Manuscript Layout", font=small_font, fill=(86, 79, 76))
    stamp.save(tmp_dir / "image2.png")

    figure = Image.new("RGB", (195, 169), (245, 240, 233))
    draw = ImageDraw.Draw(figure)
    draw.rectangle((18, 18, 177, 151), outline=colors["line"], width=3)
    draw.line((36, 128, 74, 92, 110, 106, 152, 54), fill=colors["red"], width=4)
    draw.ellipse((58, 54, 92, 88), outline=colors["gold"], width=3)
    mono_font = ImageFont.truetype(EN_SERIF, 20)
    draw.text((34, 26), "Figure Placeholder", font=mono_font, fill=colors["ink"])
    figure.save(tmp_dir / "image4.png")

    dot = Image.new("RGBA", (15, 15), (0, 0, 0, 0))
    draw = ImageDraw.Draw(dot)
    draw.ellipse((2, 2, 12, 12), fill=colors["red"])
    dot.save(tmp_dir / "image5.png")


def replace_word_text(
    document_xml: Path,
    replacements: dict[str, str],
    index_replacements: dict[int, str] | None = None,
):
    tree = ET.parse(document_xml)
    root = tree.getroot()
    non_empty_index = 0
    for node in root.findall(".//w:t", NS):
        if (node.text or "").strip():
            non_empty_index += 1
        if index_replacements and non_empty_index in index_replacements:
            node.text = index_replacements[non_empty_index]
        elif node.text in replacements:
            node.text = replacements[node.text]
    tree.write(document_xml, encoding="utf-8", xml_declaration=True)


def rebuild_zip(source_dir: Path, output_path: Path):
    with ZipFile(output_path, "w", ZIP_DEFLATED) as zip_file:
        for path in sorted(source_dir.rglob("*")):
            if path.is_file():
                zip_file.write(path, path.relative_to(source_dir))


def build_word_template(locale: str, replacements: dict[str, str]):
    source = WORD_TEMPLATE_SOURCES[locale]
    if not source.exists():
        raise FileNotFoundError(f"Missing Word template source: {source}")

    with tempfile.TemporaryDirectory() as tmp:
        work_dir = Path(tmp) / f"word-{locale}"
        media_dir = work_dir / "word" / "media"
        with ZipFile(source) as archive:
            archive.extractall(work_dir)

        generated_media = Path(tmp) / "generated-media"
        generated_media.mkdir(parents=True, exist_ok=True)
        build_brand_images(generated_media)
        for name in ["image1.png", "image2.png", "image3.jpeg", "image4.png", "image5.png"]:
            shutil.copy2(generated_media / name, media_dir / name)

        replace_word_text(
            work_dir / "word" / "document.xml",
            replacements,
            INDEX_REPLACEMENTS.get(locale),
        )
        rebuild_zip(work_dir, WORD_TEMPLATE_OUTPUTS[locale])


def build_latex_package(locale: str):
    source_dir = LATEX_DIR / locale
    if not source_dir.exists():
        raise FileNotFoundError(f"Missing LaTeX source directory: {source_dir}")
    rebuild_zip(source_dir, LATEX_OUTPUTS[locale])


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    build_word_template("en", EN_REPLACEMENTS)
    build_word_template("zh", ZH_REPLACEMENTS)
    build_latex_package("en")
    build_latex_package("zh")
    print("Generated template packages in", OUTPUT_DIR)


if __name__ == "__main__":
    main()
