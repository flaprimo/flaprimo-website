---
title: A customisable pipeline for the semi-automated discovery of online activists and social campaigns on Twitter
date: "2021-06-11T00:00:00.000Z"
category: "Data Science"
tags: [ "data science", "data analytics", "twitter analytics", "activists", "programming languages" ]
---

Journal research paper written in collaboration with [Newcastle University (UK)](https://www.ncl.ac.uk/) and [Pontifical Catholic University of Rio de Janeiro (Brazil)](http://www.puc-rio.br/) with the title "A customisable pipeline for the semi-automated discovery of online activists and social campaigns on Twitter".

Abstract
----

Substantial research is available on detecting influencers on social media platforms.

In contrast, comparatively few studies exists on the role of online activists, defined informally as users who actively participate in socially-minded online campaigns.

Automatically discovering activists who can potentially be approached by organisations that promote social campaigns is important, but not easy, as they are typically active only locally, and, unlike influencers, they are not central to large social media networks.

We make the hypothesis that such interesting users can be found on Twitter within temporally and spatially localised contexts.

We define these as small but topical fragments of the network, containing interactions about social events or campaigns with a significant online footprint.

To explore this hypothesis, we have designed an iterative discovery pipeline consisting of two alternating phases of user discovery and context discovery.

Multiple iterations of the pipeline result in a growing dataset of user profiles for activists, as well as growing set of online social contexts.

This mode of exploration differs significantly from prior techniques that focus on influencers, and presents unique challenges because of the weak online signal available to detect activists.

The paper describes the design and implementation of the pipeline as a customisable software framework, where user-defined operational definitions of online activism can be explored.

We present an empirical evaluation on two extensive case studies, one concerning healthcare-related campaigns in the UK during 2018, the other related to online activism in Italy during the COVID-19 pandemic.

Authors
----
* [Flavio Primo](https://orcid.org/0000-0003-2116-2343)
* [Paolo Missier](https://orcid.org/0000-0002-0978-2446)
* [Alexander Romanovsky](https://orcid.org/0000-0002-4076-3331)
* Rafael de Mello
* Alessandro Garcia

Links
----

*   [Research paper (full-text publicly available)](https://doi.org/10.1007/s11280-021-00887-2)
*   [Project code](https://github.com/flaprimo/twitter-network-analysis)
