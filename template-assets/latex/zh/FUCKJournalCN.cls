\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{FUCKJournalCN}[2026/03/08 F.U.C.K Journal Chinese Template]

\LoadClass[a4paper,twocolumn]{article}

\RequirePackage{ctex}
\RequirePackage{geometry}
\RequirePackage{amsmath}
\RequirePackage{amssymb}
\RequirePackage{graphicx}
\RequirePackage{booktabs}
\RequirePackage{tabularx}
\RequirePackage{caption}
\RequirePackage{xcolor}
\RequirePackage{titlesec}
\RequirePackage{setspace}
\RequirePackage{indentfirst}
\RequirePackage{cuted}
\RequirePackage{fancyhdr}
\RequirePackage{newtxtext}
\RequirePackage{newtxmath}
\RequirePackage[colorlinks=true,linkcolor=black,citecolor=black,urlcolor=black]{hyperref}

\geometry{
  left=2.35cm,
  right=2.35cm,
  top=3.5cm,
  bottom=2.6cm,
  headheight=42pt,
  headsep=0.5cm,
  footskip=0.9cm
}

\definecolor{FJAccent}{HTML}{6E1F1F}
\definecolor{FJGold}{HTML}{8C6B36}

\titleformat{\section}
  {\color{FJAccent}\bfseries\fontsize{12pt}{14pt}\selectfont}
  {\thesection.}{0.55em}{}
\titleformat{\subsection}
  {\color{FJAccent}\bfseries\fontsize{11pt}{13pt}\selectfont}
  {\thesubsection.}{0.55em}{}
\titleformat{\subsubsection}
  {\color{FJAccent}\bfseries\fontsize{10.5pt}{12pt}\selectfont}
  {\thesubsubsection.}{0.55em}{}

\titlespacing*{\section}{0pt}{1.1\baselineskip}{0.7\baselineskip}
\titlespacing*{\subsection}{0pt}{0.8\baselineskip}{0.45\baselineskip}
\titlespacing*{\subsubsection}{0pt}{0.7\baselineskip}{0.35\baselineskip}

\makeatletter
\def\normalsize{\fontsize{10.2pt}{14.2pt}\selectfont}
\makeatother
\singlespacing
\setlength{\parskip}{0pt}

\gdef\FJtitletext{}
\gdef\FJsubtitletext{}
\gdef\FJauthortext{}
\gdef\FJaffiliationtext{}
\gdef\FJabstracttext{}
\gdef\FJkeywordtext{}

\newcommand{\FJtitle}[1]{\gdef\FJtitletext{#1}}
\newcommand{\FJsubtitle}[1]{\gdef\FJsubtitletext{#1}}
\newcommand{\FJauthor}[1]{\gdef\FJauthortext{#1}}
\newcommand{\FJaffiliation}[1]{\gdef\FJaffiliationtext{#1}}
\newcommand{\FJabstract}[1]{\gdef\FJabstracttext{#1}}
\newcommand{\FJkeywords}[1]{\gdef\FJkeywordtext{#1}}

\AtBeginDocument{%
  \pagestyle{fancy}%
  \fancyhf{}%
  \fancyhead[L]{%
    \begin{tabular}{@{}l@{}}
      {\fontsize{11pt}{11pt}\selectfont\bfseries F.U.C.K Journal}\\
      {\fontsize{8pt}{9pt}\selectfont 普遍性、复杂性与知识基础}
    \end{tabular}
  }%
  \fancyhead[R]{\fontsize{8pt}{9pt}\selectfont 中文投稿模板}%
  \fancyfoot[C]{\fontsize{9pt}{9pt}\selectfont\thepage}%
  \renewcommand{\headrulewidth}{0.4pt}%
  \renewcommand{\footrulewidth}{0pt}%
}

\def\makefjtitle{%
\begin{strip}
\vspace{-2.2\baselineskip}
\begin{center}
  {\fontsize{18pt}{23pt}\selectfont\bfseries \FJtitletext\par}
  \ifx\FJsubtitletext\empty\else
    \vspace{0.65\baselineskip}
    {\fontsize{12pt}{16pt}\selectfont \itshape \FJsubtitletext\par}
  \fi
  \vspace{1.1\baselineskip}
  {\fontsize{10.5pt}{13.5pt}\selectfont \FJauthortext\par}
  \vspace{0.7\baselineskip}
  {\fontsize{9pt}{12pt}\selectfont \FJaffiliationtext\par}
\end{center}
\vspace{0.8\baselineskip}
{\fontsize{10pt}{14pt}\selectfont
\noindent{\color{FJAccent}\bfseries 摘要：}\FJabstracttext\par}
\vspace{0.55\baselineskip}
{\fontsize{10pt}{14pt}\selectfont
\noindent{\color{FJAccent}\bfseries 关键词：}\FJkeywordtext\par}
\vspace{0.7\baselineskip}
\noindent\color{FJGold}\rule{\textwidth}{0.8pt}
\end{strip}
}

\let\origthebibliography\thebibliography
\let\endorigthebibliography\endthebibliography
\renewenvironment{thebibliography}[1]{%
  \clearpage
  \onecolumn
  \origthebibliography{#1}%
}{%
  \endorigthebibliography
}

\endinput
