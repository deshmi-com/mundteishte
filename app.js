/* Mund të Ishte — standalone vanilla-JS port of the design.
   Single-state-machine app with screens: home, cases, case, calc, method, sources. */

(function () {
  "use strict";

  // ---------- DATA ----------

  const state = { screen: "home", caseId: "incinerators-scandal", calc: 430000000 };

  const units = {
    "shkolla": 3500000,
    "kopshte": 600000,
    "spitale": 45000000,
    "qendra": 60000,
    "uje": 8200000,
    "banesa": 70000,
    "km": 2000000,
    "mesues": 11400,
    "infermier": 11000,
    "rritjeMesues": 1560,
    "rritjeMjek": 2160,
    "bursa": 1000,
    "pension": 190,
    "autobus": 500000,
    "ambulanca": 70000
  };

  const unitMeta = {
    "shkolla": {
      "basis": "Mesatare nga tenderë realë 2024–25 për shkolla të reja 9-vjeçare: p.sh. 'Met Hasa' Durrës ~2,33 mln € (me TVSH) dhe 'Edith Durham' Tiranë ~4,9 mln €. Shkollat standarde ~2,3–3,2 mln €; rindërtime urbane ose komplekse të mëdha deri ~5–7 mln € (kurs ~100 lekë/euro).",
      "low": 2300000,
      "high": 6000000,
      "conf": "high",
      "recurrence": "njëherëshe",
      "sources": [
        "https://prokurimetransparente.al/en/tender/view/id/55606",
        "https://citizens.al/2024/08/06/shembet-edith-durham-494-milione-leke-per-shkollen-e-re-por-serish-klasa-me-40-nxenes/",
        "https://scantv.al/lajme/shqiperia/694-milione-leke-per-shkollen-e-re-ne-tirane-hapet-tenderi-per-n-i20987",
        "https://openprocurement.al/tenders/Kriteret/173228430261316dst.pdf"
      ]
    },
    "kopshte": {
      "basis": "Bazuar në kontrata reale prokurimi: kopsht+çerdhe i integruar (Koder-Kamëz) ~0,35 mln € dhe kopshti nr.21 (Kombinat) ~0,4 mln €. Ndërtimet e mëdha moderne kushtojnë më shumë; rasti 884 mln lekë (Vorë) u përjashtua si i fryrë — gjetje KLSH.",
      "low": 350000,
      "high": 2000000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://openprocurement.al/sq/tender/view/id/23663",
        "https://shqiptarja.com/lajm/perfundon-ndertimi-i-kopshtit-21-basha-150-femije-te-kombinatit-do-te-kene-sherbim-modern",
        "https://www.balkanweb.com/884-mln-leke-per-1-kopesht-iu-dha-bashkimit-te-operatoreve-ergi-shpk-egeu-stone-shpk-dhe-aepa-group-klsh-zbuloi-shkeljet-nuri-balla-pronari-i-nje-prej-kompanive-nen-hetim-nga-prokuroria/",
        "https://ata.gov.al/2022/08/11/kopshti-dhe-cerdhja-kei-hapesire-e-re-moderne-per-220-femije-ne-njesine-7/"
      ]
    },
    "spitale": {
      "basis": "Shqipëria ka shumë pak spitale të reja rajonale. Pikë referimi: Spitali Memorial i Fierit (2021, ~70 mln €, ndërtim i shpejtë 'turnkey'); spitali i ri qendror te QSUT ~17 mln € (vetëm struktura). €45 mln është mesatare ilustruese mes këtyre.",
      "low": 17000000,
      "high": 70000000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://euronews.al/spitali-turk-ne-fier-kosto-e-ndertimit-perllogaritet-deri-ne-70-mln-euro/",
        "https://ata.gov.al/2021/04/21/inaugurohet-spitali-rajonal-memorial-i-fierit-spitali-i-pare-publik-me-autonomi-spitalore/",
        "https://europeannewsroom.com/sq/spitali-i-ri-qendror-me-teknologji-dhe-hapesira-dinjitoze-per-mjeket-dhe-pacientet/",
        "https://www.kryeministria.al/en/newsroom/spitali-rajonal-i-lezhes-investim-modern-qe-forcon-sherbimet-shendetesore-dhe-afron-specializimet-prane-qytetareve/"
      ]
    },
    "qendra": {
      "basis": "Nga programi i Ministrisë së Shëndetësisë për rikonstruksionin e ~60 qendrave shëndetësore (4 lote, Open Procurement Albania). Loti 1 (Tiranë/Durrës/Dibër): kontratë ~93,5 mln lekë për ~17 objekte ≈ ~5,5 mln lekë/qendër (~55 mijë €).",
      "low": 45000,
      "high": 130000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "http://openprocurement.al/sq/htender/list/inst_id/1/status_id/2/keyword/rikonstruksion",
        "https://shqiptarja.com/lajm/qendra-shendetesore-paskuqan-2-me-lageshti-suva-te-rene-e-dysheme-te-demtuar-qytetaret-kushte-te-renda-60-objekte-ne-rikonstruksion",
        "https://shendetesia.gov.al/newsroom/840-milione-leke-per-rikonstruksionin-e-qendres-shendetesore-ne-kamez/",
        "https://javanews.al/sala-shendetesia-mbi-1-miliard-euro-per-2026-do-behet-dhe-rikonstruksioni-i-100-qendrave-shendetesore/"
      ]
    },
    "uje": {
      "basis": "Bazuar në investime reale për furnizim 24-orësh me ujë në qytete shqiptare. Shembull konkret: modernizimi i ujësjellësit të Gjirokastrës (stacion i ri pompimi, rezervuar dhe rrjet) me ~8,2 mln € (financim gjerman ~7 mln € + zviceran ~1 mln €, Programet e Infrastrukturës Bashkiake III/IV), që e çoi furnizimin në 24 orë/ditë për një qytet ~25 mijë banorësh. Kryqëzim: programet kombëtare (FSHZH/KfW) japin ~450–500 € për banor. Qytetet e mëdha kushtojnë në përpjesëtim më shumë — njësi ilustruese në shkallë qyteti të vogël.",
      "low": 8000000,
      "high": 10000000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://www.eda.admin.ch/countries/albania/en/home/news/news.html/content/countries/albania/en/meta/news/embassy/2023/new-water-supply-german-swiss-gjirokaster",
        "https://www.albaniandf.org/en/projekte/projekte-ne-zbatim/programi-i-ujesjellesve-rurale/",
        "https://www.kfw-entwicklungsbank.de/Global/Europe/PI-Drinking-water-supply-Albania/"
      ]
    },
    "banesa": {
      "basis": "Kosto gjithëpërfshirëse për banesë nën Programin e Rindërtimit pas tërmetit 2019: 920 mln € për 11.663 banesa ≈ ~79 mijë €/banesë (përfshin edhe infrastrukturë e bonuse qiraje). Rrumbullakuar në ~70 mijë €.",
      "low": 45000,
      "high": 95000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://shqiptarja.com/lajm/5-vite-nga-termeti-dorezohen-11663-banesa-e-apartamente-ne-5-vite-rindertim-jane-dorezuar-5524-banesa-individuale-ende-ne-rindertim-ne-5-vite-kostoja-ne-buxhet-920-mln-euro",
        "https://www.voxnews.al/english/biznes/programi-i-rindertimit-ku-shkuan-730-milione-euro-ku-banojne-sot-familjet-i53738",
        "https://www.monitor.al/rindertimi-pertej-2024-ku-po-shkojne-115-milione-eurot-e-buxhetit-te-rishikuar-2023/",
        "https://balkaninsight.com/2020/02/05/earthquake-reconstruction-would-cost-more-than-1-billion-albania-gov-says/"
      ]
    },
    "km": {
      "basis": "1 km rrugë normale dy-korsie (jo autostradë/tunel). Referenca të Bankës Botërore: Kategoria C ~1 mln €/km, Kategoria B ~4 mln €/km; të dhënat shqiptare (BIRN/ARRSH) bien brenda intervalit. ~2 mln €/km si mesatare.",
      "low": 1000000,
      "high": 4000000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://www.monitor.al/faturat-e-shfrenuara-te-ppp-ve-kostot-sa-dyfishi-i-referencave-te-bankes-boterore/",
        "https://www.reporter.al/2023/05/01/zbuloni-rruget-qe-u-ndertuan-ne-shqiperi-vitin-e-kaluar/",
        "https://www.reporter.al/2022/04/22/133-milione-euro-per-42-kilometra-rruge/",
        "https://polifakt.al/kosto-e-ndertimit-te-rrugeve-per-kilometer-dhe-mesimet-per-shqiperine/"
      ]
    },
    "mesues": {
      "basis": "Pagë vjetore bruto e një mësuesi: paga mesatare bruto ~950 €/muaj (korrik 2024, Ministria e Arsimit) → ~11.400 €/vit (950 × 12). Burim i përsëritur (vjetor).",
      "low": 11400,
      "high": 12580,
      "conf": "high",
      "recurrence": "vjetore",
      "sources": [
        "https://euronews.al/sa-paguhet-nje-mesues-ne-shqiperi-raporti-me-vendet-e-rajonit/",
        "https://arsimi.gov.al/manastirliu-rritje-historike-paga-mesatare-e-mesuesve-behet-950-euro/",
        "https://shqiptarja.com/lajm/hyn-ne-fuqi-vendimim-brenda-vitit-paga-mesatare-bruto-per-mesuesit-arrin-ne-104-mije-leke-per-mjeket-e-pergjithshem-131-mije-leke-dhe-infermieret-ne-87-mije-leke",
        "https://www.panorama.com.al/nga-70-deri-104-mije-leke-ne-muaj-tabelat-me-rritjen-e-pagave-per-mesuesit-shtesa-per-kualifikim-e-vjetersi-ne-pune-rritet-edhe-vlera-e-oreve-mbi-norme/"
      ]
    },
    "infermier": {
      "basis": "Pagë vjetore bruto e një infermieri/eje: ~87.000 lekë/muaj (korrik 2024), → ~92.500 lekë nga janari 2026 ≈ ~11.000 €/vit (kurs ~95–100 lekë/euro). Burim i përsëritur (vjetor).",
      "low": 10440,
      "high": 11800,
      "conf": "high",
      "recurrence": "vjetore",
      "sources": [
        "https://shqiptarja.com/lajm/hyn-ne-fuqi-vendimim-brenda-vitit-paga-mesatare-bruto-per-mesuesit-arrin-ne-104-mije-leke-per-mjeket-e-pergjithshem-131-mije-leke-dhe-infermieret-ne-87-mije-leke",
        "https://monitor.al/deri-ne-fund-te-2024-paga-mesatare-ne-administrate-do-shkoje-900-euro-sa-do-jete-rritja-per-mjeket-infermieret-dhe-mesuesit/",
        "https://skyweb.al/2025/11/06/sa-do-te-rriten-pagat-per-mesuesit-infermieret-dhe-policet-nga-janari-2026/"
      ]
    },
    "rritjeMesues": {
      "basis": "Kosto vjetore e një rritjeje page prej ~+130 €/muaj (~13.000 lekë) për një mësues — në shkallë me rritjen reale të pagave të mësuesve të vitit 2024 (shtesë ~12.000–14.000 lekë/muaj sipas vjetërsisë; paga mesatare bruto u çua nga ~75.900 në ~104.800 lekë/muaj). Shumë e përsëritur (vjetore); ilustrim i sa do të kushtonte t'u jepej një rritje page mësuesve për një vit.",
      "low": 1440,
      "high": 1680,
      "conf": "high",
      "recurrence": "vjetore",
      "sources": [
        "https://monitor.al/hyn-ne-fuqi-rritja-e-pagave-per-mjeket-e-sistemit-paresor-dhe-mesuesit-nga-1-korriku-shtesa-e-pages-varion-nga-12-mije-deri-14-mije-leke/",
        "https://shqiptarja.com/lajm/hyn-ne-fuqi-vendimim-brenda-vitit-paga-mesatare-bruto-per-mesuesit-arrin-ne-104-mije-leke-per-mjeket-e-pergjithshem-131-mije-leke-dhe-infermieret-ne-87-mije-leke",
        "https://www.panorama.com.al/rrogat-do-te-ristrukturohen-ne-tri-grupe-zbardhet-vendimi-i-qeverise-sa-do-rriten-pagat-per-mesuesit-e-mjeket-paga-mesatare-per-punonjesit-e-administrates-do-te-jete-900-euro/"
      ]
    },
    "rritjeMjek": {
      "basis": "Kosto vjetore e një rritjeje page prej ~+180 €/muaj (~18.000 lekë) për një mjek — në shkallë me rritjen reale të pagave të mjekëve të vitit 2024 (shtesë ~15.000–20.000 lekë/muaj). Paga mesatare bruto e mjekut të përgjithshëm arriti ~131.000 lekë/muaj (rritje kumulative ~25%); mjekët specialistë deri ~174.000 lekë/muaj. Shumë e përsëritur (vjetore); ilustrim.",
      "low": 1800,
      "high": 2400,
      "conf": "high",
      "recurrence": "vjetore",
      "sources": [
        "https://monitor.al/deri-ne-fund-te-2024-paga-mesatare-ne-administrate-do-shkoje-900-euro-sa-do-jete-rritja-per-mjeket-infermieret-dhe-mesuesit/",
        "https://monitor.al/hyn-ne-fuqi-rritja-e-pagave-per-mjeket-e-sistemit-paresor-dhe-mesuesit-nga-1-korriku-shtesa-e-pages-varion-nga-12-mije-deri-14-mije-leke/",
        "https://shqiptarja.com/lajm/hyn-ne-fuqi-vendimim-brenda-vitit-paga-mesatare-bruto-per-mesuesit-arrin-ne-104-mije-leke-per-mjeket-e-pergjithshem-131-mije-leke-dhe-infermieret-ne-87-mije-leke"
      ]
    },
    "bursa": {
      "basis": "Bursë universitare standarde: 10.000 lekë/muaj, paguar për ~10 muajt e vitit akademik (VKM 903/2016, rikonfirmuar 2024–26) = ~100.000 lekë/vit ≈ ~1.000 €/vit. Burim i përsëritur (vjetor).",
      "low": 870,
      "high": 1250,
      "conf": "high",
      "recurrence": "vjetore",
      "sources": [
        "https://arsimi.gov.al/bursa-dhe-programe-studimi/",
        "https://shqiptarja.com/lajm/mbeshtetje-financiare-me-page-minimale-per-444-studente-ekselente-dhe-programeve-prioritare-kumbaro-viti-20252026-shenon-kulmin-e-kesaj-politike",
        "https://akfal.gov.al/sq/sherbime/bursa-dhe-mbeshtetja-studentore/"
      ]
    },
    "pension": {
      "basis": "Pension mujor mesatar pleqërie 2024 ~19.092 lekë (INSTAT/ISSH); urban ~19.609 lekë, rural ~11.878 lekë ≈ ~190 €/muaj (kurs ~100 lekë/euro). Burim i përsëritur (mujor).",
      "low": 119,
      "high": 196,
      "conf": "high",
      "recurrence": "mujore",
      "sources": [
        "https://shqiptarja.com/lajm/ekskluzive-pensionet-do-te-indeksohen-me-25-ne-tetor-pensionet-urbane-rriten-me-490-leke-mesatarisht-ruralet-296-leke",
        "https://monitor.al/2024-pensionet-e-reja-13-me-te-uleta-se-mesatarja-aktuale/",
        "https://www.panorama.com.al/rritet-me-tej-diferenca-e-pagave-me-pensionet-inflacioni-rendon-te-moshuarit-cfare-tregojne-te-dhenat-e-instat/"
      ]
    },
    "autobus": {
      "basis": "Çmim i një autobusi urban elektrik 'deri në gjysmë milioni euro' (Bashkia e Tiranës, sipas Exit.al); konfirmuar nga projekti e-BRT 'Green Transport Tirana' (BE/KfW, 58 autobusë elektrikë).",
      "low": 350000,
      "high": 650000,
      "conf": "medium",
      "recurrence": "njëherëshe",
      "sources": [
        "https://exit.al/bashkia-premton-autobuse-elektrike-gjysme-milione-eurosh-por-harron-pse-rriti-cmimin-e-biletave/",
        "https://www.wbif.eu/project-detail/PRJ-ALB-ENE-050",
        "https://www.eeas.europa.eu/delegations/albania/european-union-and-germany-support-green-transport-tirana-812-million-euro-investments_en"
      ]
    },
    "ambulanca": {
      "basis": "Vlerësim rajonal (Ballkani Perëndimor) për një ambulancë të re të pajisur: ~63,5 mijë € (prokurim me 100 njësi, Maqedonia e Veriut) deri ~74,5 mijë € (20 njësi ~1,49 mln € sipas auditimit). Jo një tender specifik shqiptar — prandaj besueshmëri e ulët.",
      "low": 60000,
      "high": 90000,
      "conf": "low",
      "recurrence": "njëherëshe",
      "sources": [
        "https://portalb.mk/ministria-e-shendetesise-e-rmv-se-perzgjodhi-kompanine-per-furnizimin-me-100-autoambulanca/",
        "https://lajmi.net/zka-demaskon-skandalet-ne-msh-1-7-milione-euro-projekt-i-vonuar-20-autoambulanca-jashte-standardeve-dhe-pagesa-pa-dokumente/",
        "https://telegrafi.com/aliu-institucionet-shendetesore-do-te-pajisen-me-100-ambulanca-te-reja/"
      ]
    }
  };

  const icons = {
    "shkolla": "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
    "kopshte": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
    "spitale": "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M12 7v6M9 10h6",
    "qendra": "M12 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8v8M8 12h8",
    "uje": "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C8 11.1 7 13 7 15a7 7 0 0 0 7 7z",
    "km": "M4 19 8 5M16 5l4 14M12 5v3M12 11v2M12 17v2",
    "banesa": "M3 21h18M6 21V8l6-4 6 4v13M10 21v-5h4v5",
    "mesues": "M12 7v14 M3 18a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3z M21 18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-5a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3z",
    "infermier": "M22 12h-4l-3 9L9 3l-3 9H2",
    "rritjeMesues": "M22 10 12 5 2 10l10 5 10-5z M6 12.5V17c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4.5 M19 11v5",
    "rritjeMjek": "M12 21s-6.5-4.4-9-8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2.5 4.1-9 8.5-9 8.5z M12 9.5v4 M10 11.5h4",
    "bursa": "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
    "pension": "M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M6 10h.01 M18 14h.01",
    "autobus": "M4 6h13a2 2 0 0 1 2 2v7H4z M19 9h1l2 3v3h-3 M4 10h15 M8 6v4 M13 6v4 M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M16 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    "ambulanca": "M3 7h11v8H3z M14 10h3.5L21 13v2h-7z M7.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M16.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M7 9.5v3 M5.5 11h3"
  };

  const catalogMeta = [
    {
      "key": "shkolla",
      "label": "Shkolla 9-vjeçare"
    },
    {
      "key": "kopshte",
      "label": "Kopshte (me çerdhe)"
    },
    {
      "key": "spitale",
      "label": "Spitale rajonale"
    },
    {
      "key": "qendra",
      "label": "Qendra shëndetësore (rikonstruksion)"
    },
    {
      "key": "uje",
      "label": "Qytete me ujë 24-orësh (si Gjirokastra)"
    },
    {
      "key": "banesa",
      "label": "Banesa (rindërtim)"
    },
    {
      "key": "km",
      "label": "Km rrugë të asfaltuara"
    },
    {
      "key": "mesues",
      "label": "Paga vjetore mësuesi"
    },
    {
      "key": "infermier",
      "label": "Paga vjetore infermieri"
    },
    {
      "key": "rritjeMesues",
      "label": "Rritje page +130 €/muaj për mësues"
    },
    {
      "key": "rritjeMjek",
      "label": "Rritje page +180 €/muaj për mjekë"
    },
    {
      "key": "bursa",
      "label": "Bursa studentore (vjetore)"
    },
    {
      "key": "pension",
      "label": "Pensione mujore"
    },
    {
      "key": "autobus",
      "label": "Autobusë urbanë (elektrikë)"
    },
    {
      "key": "ambulanca",
      "label": "Ambulanca të reja"
    }
  ];

  const statusMeta = {
    kontrate:  { text: "Kontratë publike",      c: "#9b9da3", desc: "Vlera zyrtare e një kontrate publike apo koncesioni." },
    klsh:      { text: "Gjetje e KLSH",          c: "#e8a13e", desc: "Gjetje nga Kontrolli i Lartë i Shtetit (auditim)." },
    spak:      { text: "Nën hetim nga SPAK",     c: "#e0635b", desc: "Çështje në hetim nga Prokuroria e Posaçme. Pa vendim përfundimtar." },
    gjykate:   { text: "Vendim gjykate",         c: "#6f9fe0", desc: "Vendim i dhënë nga gjykata." },
    arbitrazh: { text: "Detyrim nga arbitrazhi", c: "#b07be0", desc: "Detyrim financiar i vendosur nga arbitrazhi ndërkombëtar." },
    ilustrues: { text: "Krahasim ilustrues",     c: "#56b06a", desc: "Krahasim ilustrues bazuar në projekte publike të ngjashme." },
    zyrtar:    { text: "Burim zyrtar",           c: "#46b3a6", desc: "Burim zyrtar institucional (raport, vendim, regjistër)." },
    mediatik:  { text: "Burim mediatik",         c: "#9b9da3", desc: "Burim mediatik i raportuar publikisht." },
    proces:    { text: "Në proces",              c: "#e8a13e", desc: "Çështje ende në proces, pa vendim përfundimtar." },
  };

  const cases = [
    {
      "id": "incinerators-scandal",
      "sector": "Mbetjet urbane / energjia nga djegia (koncesion PPP)",
      "year": "2014–2026",
      "value": 430000000,
      "shortTitle": "Skandali i inceneratorëve",
      "title": "Skandali i inceneratorëve: tre koncesionet e djegies së mbetjeve në Tiranë, Elbasan dhe Fier",
      "valueLabel": "Kosto e parashikuar e tre koncesioneve gjatë 30 vjetëve (vlerësim KLSH/BIRN, deri në 2047)",
      "blurb": "Tre koncesione 30-vjeçare për djegien e mbetjeve — Elbasani (2014), Fieri (2016) dhe Tirana (2017) — me kosto të parashikuar deri në rreth 430 milionë euro për buxhetin gjatë afatit, ndërsa impiantet kanë funksionuar pak ose aspak. Çështja u kthye në skandalin kryesor të parasë publike në Shqipëri: dënime përfundimtare për Elbasanin, rigjykim për Fierin dhe dërgim për gjyq i ish-zëvendëskryeministrit Arben Ahmetaj në mars 2026.",
      "summary": "\"Afera e inceneratorëve\" përfshin tre koncesione PPP (BOT) 30-vjeçare për djegien e mbetjeve urbane: Elbasani (dhjetor 2014, kompania Albtech Energy), Fieri (tetor 2016, vlerë rreth 35 milionë euro me TVSH) dhe Tirana (gusht 2017, kompania Integrated Energy/“Integrated Technology Service”). KLSH-ja gjeti se vlera reale e koncesionit të Tiranës ishte rreth 296 milionë euro — rreth 118 milionë euro më shumë sesa u deklarua zyrtarisht — dhe se vlerësimi i kostos totale të tre koncesioneve gjatë 30 vjetëve arrin deri në rreth 430 milionë euro (deri në 2047). Sipas BIRN, deri tani publiku ka paguar rreth 150 milionë euro, ndërsa raportet/auditimet flasin për rreth 70,2 milionë euro (me TVSH) për Elbasanin e Fierin. Asnjë nga impiantet nuk ka djegur mbetje në mënyrë të qëndrueshme; impianti i Fierit nuk ka funksionuar dhe ai i Tiranës mbeti i papërfunduar.\n\nHetimi nisi në 2021 pas kallëzimeve të opozitës; në 2022 SPAK procedoi 21 individë dhe 12 persona juridikë për shpërdorim detyre, korrupsion aktiv/pasiv, pastrim parash dhe mashtrim me TVSH. Për dosjen e Elbasanit ka vendim përfundimtar (formë e prerë): ish-ministri i Mjedisit Lefter Koka u dënua me 6 vjet e 8 muaj burg (i ashpërsuar nga Apeli i GJKKO në nëntor 2024 dhe i lënë në fuqi nga Gjykata e Lartë), biznesmeni Klodian Zoto me 10 vjet (në mungesë) dhe ish-deputeti Alqi Bllako me 2 vjet e 8 muaj. Dosja e Fierit u kthye për rigjykim në dhjetor 2024. Më 18 mars 2026 SPAK dërgoi për gjyq ish-zëvendëskryeministrin Arben Ahmetaj dhe 10 të tjerë (përfshirë biznesmenët Mirel Mërtiri dhe Klodian Zoto): Ahmetaj akuzohet se mori rreth 700 mijë euro nga Zoto e Mërtiri në formë ryshfeti përmes ndërmjetësve, shitjesh fiktive dhe pasurish; ai është në arrati dhe kërkon azil në Zvicër. Ky proces nuk ka ende vendim — vlen prezumimi i pafajësisë.",
      "status": [
        "klsh",
        "spak",
        "gjykate",
        "kontrate",
        "proces"
      ],
      "facts": [
        {
          "label": "Kosto e parashikuar e tre koncesioneve për 30 vjet (deri 2047)",
          "value": "deri në ~430 milionë euro (vlerësim); KLSH/BIRN. Vlera reale e koncesionit të Tiranës u gjet ~296 mln euro, ~118 mln më shumë se e deklaruara",
          "statusKey": "klsh",
          "source": "KLSH / BIRN / VoxNews / Panorama (raportim mbi auditimin)"
        },
        {
          "label": "Para publike të paguara deri tani",
          "value": "~70,2 milionë euro (me TVSH) për Elbasanin e Fierin sipas auditimit/medias; ~150 milionë euro gjithsej sipas vlerësimit të BIRN",
          "statusKey": "klsh",
          "source": "Transparency International (CEPI) / BIRN"
        },
        {
          "label": "Dosja e Elbasanit — vendim përfundimtar (formë e prerë)",
          "value": "Lefter Koka 6 vjet e 8 muaj burg (ashpërsuar nga Apeli, lënë në fuqi nga Gjykata e Lartë); Klodian Zoto 10 vjet (në mungesë); Alqi Bllako 2 vjet e 8 muaj; 9 të dënuar gjithsej",
          "statusKey": "gjykate",
          "source": "Apeli i GJKKO (nëntor 2024) / Gjykata e Lartë; Balkanweb, Shqiptarja.com"
        },
        {
          "label": "Dosja e Ahmetajt (Tirana) — dërguar për gjyq 18 mars 2026",
          "value": "Arben Ahmetaj akuzohet se mori ~700 mijë euro ryshfet nga Zoto e Mërtiri; 11 të pandehur; korrupsion pasiv, fshehje pasurie, pastrim parash. Ende pa vendim — prezumimi i pafajësisë. Ahmetaj në arrati në Zvicër",
          "statusKey": "spak",
          "source": "SPAK; Shqiptarja.com, Panorama (mars 2026)"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Wikipedia — Albanian incinerators scandal (përmbledhje me referenca)",
          "url": "https://en.wikipedia.org/wiki/Albanian_incinerators_scandal"
        },
        {
          "kind": "mediatik",
          "label": "Transparency International (CEPI) — Rasti Arben Ahmetaj / koncesionet e inceneratorëve",
          "url": "https://www.transparency.org/en/cepi/cases/albania-arben-ahmetaj-deputy-pm-involved-inincinerators-concession-scandal-"
        },
        {
          "kind": "spak",
          "label": "Shqiptarja.com — SPAK çon në gjyq Ahmetajn e 10 të tjerë (mars 2026): ~700 mijë euro nga Zoto e Mërtiri",
          "url": "https://shqiptarja.com/lajm/dosja-per-inceneratorin-e-elbasanit-spak-dergon-ne-gjyq-arben-ahmetajn-e-10-te-tjere-akuza-per-korrupsion-dhe-pastrim-parash"
        },
        {
          "kind": "gjykate",
          "label": "Shqiptarja.com — Dosja: Elbasani vendim i prerë me 9 të dënuar, Fieri në rigjykim (GJKKO)",
          "url": "https://shqiptarja.com/lajm/dosja-si-nisi-ceshtja-inceneratoret-nga-politika-te-gjkko-elbasani-vendim-te-prere-me-9-te-denuar-fieri-ne-rigjykim"
        },
        {
          "kind": "mediatik",
          "label": "VoxNews — Si u shfryën 430 mln eurot e aferës së inceneratorëve",
          "url": "https://www.voxnews.al/fokus/si-u-shfryne-430-mln-eurot-e-aferes-se-inceneratoreve-i2043"
        }
      ],
      "note": "Shifra prej ~430 mln euro është kosto e PARASHIKUAR e tre koncesioneve gjatë 30 vjetëve (deri 2047), jo para të paguara deri tani; para publike efektivisht të paguara janë shumë më të ulëta (~70,2 mln euro për Elbasanin e Fierin). Vetëm dosja e Elbasanit ka vendim përfundimtar; për Fierin pritet rigjykim dhe dosja e Tiranës/Ahmetajt është në gjykim e sipër (prezumimi i pafajësisë)."
    },
    {
      "id": "tirana-incinerator-geogenix",
      "sector": "Mbetjet urbane / energji nga djegia (PPP, koncesion)",
      "year": "2017–2026",
      "value": 128248330,
      "shortTitle": "Inceneratori i Tiranës",
      "title": "Koncesioni i inceneratorit dhe landfillit të Tiranës (Integrated Energy B.V. SPV / Geogenix B.V.)",
      "valueLabel": "Vlera e investimit të koncesionit (pa TVSH), sipas kontratës nr. 6597, datë 31.08.2017",
      "blurb": "Inceneratori më i madh i paketës së tre djegësave — një impiant që, sipas auditimeve dhe hetimit, mbeti i pandërtuar megjithëse shteti pagoi dhjetëra miliona euro. SPAK e vuri nën sekuestro më 1 gusht 2023 dhe pretendon se pronarët faktikë janë biznesmenët Klodian Zoto dhe Mirel Mërtiri, përmes një zinxhiri kompanish me bazë në Holandë.",
      "summary": "Më 31 gusht 2017, Ministria e Mjedisit nënshkroi me kompaninë \"Integrated Energy B.V. SPV sh.p.k\" kontratën koncesionare nr. 6597 për ndërtimin e landfillit, inceneratorit dhe rehabilitimin e vendgrumbullimeve ekzistuese të mbetjeve në Tiranë, me afat 30-vjeçar dhe me vlerë investimi 128,248,330 euro (pa TVSH). Sipas raportimeve, deri në vitin 2022 nga buxheti i shtetit ishin paguar rreth 40.7 milionë euro, ndërsa burime të tjera e vlerësojnë shumën totale të paguar për kontratën e Tiranës në rreth 63 milionë euro (me TVSH); ndërkohë inceneratori mbeti i pandërtuar dhe vetëm landfilli funksiononte. Më 28 korrik 2023 Gjykata e Posaçme vendosi sekuestrimin dhe SPAK e ekzekutoi më 1 gusht 2023, duke caktuar administrator shtetëror. SPAK pretendon se pronarët faktikë të kompanisë koncesionare dhe të kompanisë mëmë në Holandë \"Integrated Energy B.V.\" (më vonë e riemërtuar \"Geogenix B.V.\") janë Klodian Zoto dhe Mirel Mërtiri, dhe se grupi pastroi rreth 20 milionë euro nëpërmjet faturave fiktive (rreth 409,428,000 lekë) të nënkontraktorit \"Integrated Energy Services\". Më 16 korrik 2024 SPAK lëshoi 8 urdhër-arreste, asnjë i ekzekutuar pasi Zoto dhe Mërtiri janë në arrati. Më 18 mars 2026 SPAK dërgoi për gjykim ish-zëvendëskryeministrin Arben Ahmetaj dhe 10 të tjerë, me akuza për korrupsion, fshehje pasurie dhe pastrim parash; sipas SPAK, Zoto e Mërtiri i dhanë Ahmetajt përfitime që në episode të verifikuara arrijnë rreth 491–700 mijë euro. Të gjitha akuzat mbeten pretendime; nuk ka vendim gjyqësor të formës së prerë.",
      "status": [
        "kontrate",
        "klsh",
        "spak",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera e investimit të koncesionit (kontrata nr. 6597, 31.08.2017, afat 30-vjeçar)",
          "value": "128,248,330 euro (pa TVSH)",
          "statusKey": "kontrate",
          "source": "Euronews Albania / SPAK (njoftim sekuestroje)"
        },
        {
          "label": "Para publike të paguara koncesionarit (kontrata e Tiranës)",
          "value": "~40.7 mln euro deri në qershor 2022 (KLSH/Monitor); ~63 mln euro me TVSH gjithsej (Transparency International CEPI)",
          "statusKey": "klsh",
          "source": "Revista Monitor (të dhëna nga KLSH) / Transparency International CEPI"
        },
        {
          "label": "Shumë e pretenduar e pastruar nga 'grupi kriminal' përmes faturave fiktive",
          "value": "~20 mln euro (fatura fiktive ~409,428,000 lekë nga nënkontraktori Integrated Energy Services)",
          "statusKey": "spak",
          "source": "Reporter.al (BIRN) / SPAK, 16 korrik 2024"
        },
        {
          "label": "Statusi i impiantit dhe i hetimit",
          "value": "Inceneratori i pandërtuar (vetëm landfilli funksiononte); sekuestruar nga SPAK më 1 gusht 2023; 8 urdhër-arreste më 16.07.2024 (asnjë i ekzekutuar); çështja dërguar për gjykim më 18 mars 2026",
          "statusKey": "proces",
          "source": "Tirana Times / Euronews Albania / Balkanweb (SPAK)"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Euronews Albania — SPAK vë në sekuestro inceneratorin dhe landfillin e Tiranës (vlera 128,248,330 euro; 491 mijë euro ryshfet; 409,428,000 lekë fatura fiktive)",
          "url": "https://euronews.al/en/spak-sequesters-tirana-incinerator-and-landfill/"
        },
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN) — SPAK: në aferën e inceneratorit të Tiranës u pastruan 20 milionë euro; 8 urdhër-arreste, 16 korrik 2024",
          "url": "https://www.reporter.al/2024/07/16/spak-ne-aferen-e-inceneratorit-te-tiranes-u-pastruan-20-milion-euro/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Inceneratori i Tiranës mori 40.7 mln euro pagesa (të dhëna nga KLSH), 2018–qershor 2022",
          "url": "https://monitor.al/inceneratori-i-tiranes-merr-3-3-mln-pagesa-ne-6-mujorin-e-pare-2022-gjithsej-40-7-mln-euro/"
        },
        {
          "kind": "mediatik",
          "label": "Transparency International (CEPI) — Rasti Arben Ahmetaj: ~63 mln euro nga buxheti për kontratën e Tiranës; vetëm landfilli, inceneratori i vonuar",
          "url": "https://www.transparency.org/en/cepi/cases/albania-arben-ahmetaj-deputy-pm-involved-inincinerators-concession-scandal-"
        },
        {
          "kind": "mediatik",
          "label": "Balkanweb / News24 — Inceneratorët: SPAK dërgon për gjykim Arben Ahmetajn dhe 10 të tjerë (18 mars 2026), korrupsion dhe pastrim parash",
          "url": "https://www.balkanweb.com/en/inceneratoret-me-akuzen-korrupsion-dhe-pastrim-parash-spak-dergon-per-gjykim-arben-ahmetajn-dhe-10-te-tjere/"
        }
      ],
      "note": "Vlera kryesore (128.2 mln euro) është vlera e investimit sipas kontratës, jo para të humbura apo të vjedhura; shuma e paguar realisht (~40.7–63 mln euro) dhe shuma e pretenduar si e pastruar (~20 mln euro) raportohen veçmas dhe mbeten në fazë hetimi/gjykimi, pa vendim të formës së prerë."
    },
    {
      "id": "sterilization-concession-saniservice",
      "sector": "Shëndetësi — Partneritet Publik-Privat (PPP/koncesion)",
      "year": "2015–2026",
      "value": 100000000,
      "shortTitle": "Koncesioni i sterilizimit (SaniService)",
      "title": "Koncesioni i sterilizimit të instrumenteve kirurgjikalë (SaniService / Investital)",
      "valueLabel": "Vlera e parashikuar e kontratës koncesionare për 10 vjet (~100 mln euro)",
      "blurb": "Koncesioni 10-vjeçar për sterilizimin e instrumenteve kirurgjikalë, materialet njëpërdorimëshe dhe trajtimin e mbetjeve, i firmosur në dhjetor 2015 nga ish-ministri i Shëndetësisë Ilir Beqaj me kompaninë SaniService (e udhëhequr nga Investital sh.p.k. e Ilir Rrapajt). I vlerësuar rreth 100 mln euro për 10 vjet; deri në 2022 shteti kishte paguar rreth 8 mld lekë (~76 mln euro). SPAK lëshoi 8 masa sigurie në gusht 2023 dhe çoi çështjen në gjyq; KLSH dhe komisioni hetimor ngritën shqetësime për rritje çmimesh dhe transferim falas të pajisjeve shtetërore. Më 4 mars 2026 GJKKO dha vendimin e shkallës së parë: Klodian Rrjepaj dhe Ilir Rrapaj u dënuan me nga 4 vjet burg (6 vjet të reduktuara për gjykim të shkurtuar), por u shpallën të pafajshëm për akuzën 'grup i strukturuar kriminal'; ish-ministri Beqaj gjykohet veçmas. Vendimi nuk është ende i formës së prerë.",
      "summary": "Më 10 dhjetor 2015 Ministria e Shëndetësisë, e përfaqësuar nga ministri Ilir Beqaj, firmosi një kontratë koncesioni/PPP 10-vjeçare me kompaninë SaniService për sterilizimin e personalizuar të instrumenteve kirurgjikalë, furnizimin me material steril njëpërdorimësh në salla, trajtimin e mbetjeve biologjike dhe dezinfektimin e sallave. Vlera e parashikuar e kontratës ishte rreth 100 milionë euro për 10 vjet. Aksioneri kryesor i SaniService me 40% ishte Investital sh.p.k. — një kompani e vogël e themeluar në Kosovë me kapital rreth 1.000 euro nga biznesmeni Ilir Rrapaj — ndërsa pjesa tjetër mbahej nga tri kompani italiane: Servizi Italia S.p.A. (30%), Tecnosanimed (15%) dhe U.Jet S.r.l. (15%).\n\nSipas raportimeve, deri në fund të 2022-shit shteti kishte paguar rreth 8 miliardë lekë (~76 milionë euro). Auditime të KLSH dhe komisioni hetimor parlamentar ngritën shqetësime për mbipagesa vjetore (p.sh. ~3.5 mln euro mbi kontratën në 2019), për përfshirjen e barnave dhe materialeve mjekësore prej rreth 283.3 mln lekësh (56.4% e kostove) si shpenzime 'sterilizimi', si dhe për transferimin pa pagesë te koncesionari të një qendre moderne sterilizimi të ndërtuar me kredi shtetërore në QSU 'Nënë Tereza', e cila — sipas raportimeve — nuk u vu kurrë në punë.\n\nMë 16–17 gusht 2023 SPAK ekzekutoi 8 masa sigurie: u arrestuan ish-zëvendësministri i Shëndetësisë Klodian Rrjepaj dhe biznesmeni Ilir Rrapaj; më pas (nëntor 2023) iu caktua masë sigurie edhe ish-ministrit Ilir Beqaj. Më 4 mars 2026 Gjykata e Posaçme (GJKKO) dha vendimin e shkallës së parë: Rrjepaj dhe Rrapaj u shpallën fajtorë për 'vjedhje duke shpërdoruar detyrën' dhe falsifikim dokumentesh dhe u dënuan me nga 6 vjet, të reduktuara në 4 vjet për shkak të gjykimit të shkurtuar — por u shpallën të pafajshëm për akuzën 'grup i strukturuar kriminal', e cila u rrëzua. Të dy u liruan, pasi koha e paraburgimit u llogarit se e mbulonte dënimin. Bashkëtëpandehur të tjerë morën dënime më të ulëta ose me kusht. Ish-ministri Ilir Beqaj gjykohet veçmas, me procedurë të zakonshme. Ky vendim i shkallës së parë është i apelueshëm dhe çështja nuk ka ende vendim të formës së prerë — të gjithë gëzojnë prezumimin e pafajësisë.",
      "status": [
        "kontrate",
        "klsh",
        "spak",
        "gjykate",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera e parashikuar e kontratës koncesionare (10 vjet)",
          "value": "Rreth 100 milionë euro, kontratë e firmosur më 10 dhjetor 2015 nga ish-ministri Ilir Beqaj me SaniService",
          "statusKey": "kontrate",
          "source": "Shqiptarja.com / Reporter.al (BIRN)"
        },
        {
          "label": "Para publike efektivisht të paguara koncesionarit (deri 2022)",
          "value": "Rreth 8 miliardë lekë (~76 milionë euro) sipas raportimeve",
          "statusKey": "mediatik",
          "source": "Shqiptarja.com (raportim mbi dosjen e SPAK)"
        },
        {
          "label": "Gjetje të auditimit / komisionit hetimor",
          "value": "Mbipagesa vjetore (p.sh. ~3.5 mln euro mbi kontratën në 2019); ~283.3 mln lekë barna/materiale të llogaritura si 'sterilizim'; transferim pa pagesë i qendrës së sterilizimit të ndërtuar me kredi shtetërore",
          "statusKey": "klsh",
          "source": "Revista Monitor; GJKKO/Shqiptarja.com; KLSH"
        },
        {
          "label": "Statusi penal (SPAK / GJKKO)",
          "value": "Vendim i shkallës së parë (4 mars 2026): Klodian Rrjepaj dhe Ilir Rrapaj fajtorë për 'vjedhje me shpërdorim detyre' + falsifikim, nga 6 vjet të reduktuara në 4 vjet (gjykim i shkurtuar); akuza 'grup i strukturuar kriminal' u rrëzua; të dy u liruan për kohë të vuajtur. Ish-ministri Beqaj gjykohet veçmas. Jo i formës së prerë — prezumimi i pafajësisë.",
          "statusKey": "gjykate",
          "source": "GJKKO (mars 2026); Report TV, Shqiptarja.com"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com — SPAK arreston Rrjepajn dhe Rrapajn; detaje të kontratës dhe pagesat (8 mld lekë / 76 mln euro)",
          "url": "https://shqiptarja.com/lajm/koncesioni-per-sterilizimin-arrestohet-ishzv-ministri-i-shendetesise-klodian-rjepaj"
        },
        {
          "kind": "mediatik",
          "label": "Zëri i Amerikës (VOA) — SPAK arreston ish-zv.ministrin Rrjepaj dhe biznesmenin Rrapaj",
          "url": "https://www.zeriamerikes.com/a/7228746.html"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Mbipagesa vjetore mbi kontratën (~3.5 mln euro më shumë në 2019)",
          "url": "https://www.monitor.al/koncesioni-i-sterilizimit-del-jashte-kontrollit-edhe-kete-vit-3-5-mln-euro-me-shume-se-kontrata/"
        },
        {
          "kind": "gjykate",
          "label": "Shqiptarja.com — Gjetjet e GJKKO: koncesion i paracaktuar, manipulim shifrash, ~283.3 mln lekë",
          "url": "https://shqiptarja.com/lajm/sterilizimi-gjkko-shkelqim-cani-shkeli-ligjin-kur-i-miratoi-beqajt-te-njejtin-studim-fizibiliteti-qe-me-pare-e-refuzoi-u-shty-nga-beqja-ka-vepruar-me-dashje"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com — SPAK kërkon ~36 vjet e 6 muaj burg për 8 të pandehurit",
          "url": "https://shqiptarja.com/lajm/sterilizimi-spak-kerkon-nga-10-vite-burg-per-ihzvministrin-rjepaj-dhe-biznesmenin-rrapaj"
        },
        {
          "kind": "gjykate",
          "label": "Report TV — Dosja 'Sterilizimi': GJKKO mbyll gjyqin, vendimi më 4 mars 2026",
          "url": "https://report-tv.al/lajm/dosja-sterilizimi-gjkko-mbyll-shqyrtimin-gjyqesor-pwr-8-tw-pandehurit-vendimi-do-te-shpallet-me-date-4-mars"
        }
      ],
      "note": "Shifra kryesore (~100 mln euro) është vlera zyrtare e parashikuar e kontratës 10-vjeçare, jo dëm i provuar nga gjykata; para publike efektivisht të paguara (~76 mln euro deri 2022) raportohet nga media. Ka vendim të shkallës së parë (mars 2026), por jo të formës së prerë; akuza për 'grup të strukturuar kriminal' u rrëzua dhe gjykimi i ish-ministrit Beqaj vijon veçmas — prezumimi i pafajësisë."
    },
    {
      "id": "health-ppp-concessions-package",
      "sector": "Shëndetësi",
      "year": "2015-2026",
      "value": 47000000,
      "shortTitle": "Koncesionet e shëndetësisë (PPP)",
      "title": "Paketa e koncesioneve shëndetësore PPP: check-up, sterilizim, dializë dhe laboratorë",
      "valueLabel": "Dëm ekonomik i vlerësuar nga auditimi (KLSH), rreth 5.6 miliardë lekë deri në fund të 2021",
      "blurb": "Katër shërbime publike shëndetësore - check-up, sterilizimi i instrumenteve kirurgjikale, hemodializa dhe laboratorët - u kaluan te kompani private përmes koncesioneve/PPP gjatë 2015-2019, me një vlerë totale kontraktore rreth 45.5 miliardë lekë (376 milionë euro) për 10 vjet. Auditimi i KLSH-së (dhjetor 2022) gjeti probleme sistematike: pagesa për shërbime të pakryera dhe TVSH e aplikuar në kundërshtim me ligjin, me një dëm ekonomik të vlerësuar rreth 5.6 miliardë lekë (47 milionë euro) deri në fund të 2021. Koncesioni i sterilizimit ka kaluar në SPAK dhe GJKKO, ndërsa ish-ministri Ilir Beqaj gjykohet veçmas (pa vendim përfundimtar).",
      "summary": "Gjatë mandatit të ministrit Ilir Beqaj, Ministria e Shëndetësisë kaloi te sektori privat katër shërbime publike përmes koncesioneve/Partneritetit Publik-Privat: kontrolli bazë mjekësor (\"check-up\", fituar nga 3P Life Logistic, 2015), sterilizimi i instrumenteve kirurgjikale (Sani Service, fund 2015), hemodializa (DiaVita, 2015) dhe shërbimi laboratorik spitalor (Laboratory Networks, 2019). Vlera totale e katër kontratave për gjithë periudhën koncesionare raportohet rreth 45.5 miliardë lekë ose 376 milionë euro; Transparency International e vlerëson në minimum rreth 310 milionë euro, ndërsa disa media flasin për deri në ~420 milionë euro me projeksione.\n\nAuditimi përfundimtar i KLSH-së (raportuar dhjetor 2022) evidentoi se ndërsa kompanitë marrin miliona euro në vit nga taksapaguesit, një pjesë e pagesave shkon për shërbime që pacientët shqiptarë nuk i marrin. KLSH dhe analiza e organizatës \"Së bashku për Jetën\" vlerësuan një dëm ekonomik rreth 5.6 miliardë lekë (rreth 47 milionë euro) deri në fund të 2021, ku rreth 4.1 miliardë lekë lidhen me aplikimin e TVSH-së në shërbimet e \"check-up\" dhe sterilizimit në kundërshtim me ligjin nr. 92/2014, dhe pjesa tjetër me pagesa për shërbime/seanca të parealizuara (p.sh. dializa). KLSH gjeti gjithashtu mungesë monitorimi të kontratave dhe pajisje publike dhënë falas koncesionarit.\n\nÇështja u shndërrua në një nga dosjet kryesore të SPAK. Koncesioni i sterilizimit përfundoi në gjyq: më 4 mars 2026 GJKKO shpalli vendimin për tetë të pandehur me procedurë të shkurtuar (ish-zëvendësministri Klodian Rrjepaj dhe biznesmeni Ilir Rrapaj me dënime të reduktuara), ndërsa ish-ministri Ilir Beqaj gjykohet veçmas me procedurë të zakonshme dhe nuk ka vendim përfundimtar - vlen prezumimi i pafajësisë. Tre koncesionet e tjera (check-up, dializë, laboratorë) mbeten nën hetim, pa dënim përfundimtar.",
      "status": [
        "klsh",
        "kontrate",
        "spak",
        "gjykate",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera totale e katër kontratave koncesionare (10 vjet)",
          "value": "Rreth 45.5 miliardë lekë / 376 milionë euro (Transparency International: minimum ~310 milionë euro; disa media deri ~420 milionë euro me projeksione)",
          "statusKey": "kontrate",
          "source": "Citizens.al / Monitor.al / Transparency International / Balkanweb"
        },
        {
          "label": "Dëm ekonomik i vlerësuar nga auditimi deri në fund të 2021",
          "value": "Rreth 5.6 miliardë lekë (~47 milionë euro): pagesa për shërbime të pakryera + TVSH e aplikuar në kundërshtim me ligjin; nga këto rreth 4.1 miliardë lekë i përkasin TVSH-së për check-up dhe sterilizim",
          "statusKey": "klsh",
          "source": "Auditim i KLSH-së (raportuar dhjetor 2022) dhe analizë e 'Së bashku për Jetën', via Citizens.al / Monitor.al"
        },
        {
          "label": "Hetimi i SPAK dhe gjykimi i koncesionit të sterilizimit",
          "value": "Koncesion ~100-114 milionë euro; më 4 mars 2026 GJKKO dënoi 8 të pandehur me procedurë të shkurtuar (Rrjepaj dhe Rrapaj me dënime të reduktuara). Ish-ministri Ilir Beqaj gjykohet veçmas, pa vendim përfundimtar - prezumim pafajësie",
          "statusKey": "gjykate",
          "source": "Shqiptarja.com / Euronews Albania / Zëri i Amerikës"
        },
        {
          "label": "Tre koncesionet e tjera (check-up, dializë, laboratorë)",
          "value": "Nën hetim nga SPAK; KLSH evidentoi p.sh. ~231.8 milionë lekë tejkalime te check-up dhe pagesa për seanca dialize të parealizuara; pa dënim përfundimtar",
          "statusKey": "spak",
          "source": "Raport përfundimtar KLSH (MSHMS), klsh.org.al; Monitor.al"
        }
      ],
      "sources": [
        {
          "kind": "klsh",
          "label": "KLSH - Raport përfundimtar auditimi në Ministrinë e Shëndetësisë dhe Mbrojtjes Sociale (koncesionet PPP, TVSH, shërbime të pakryera)",
          "url": "https://www.klsh.org.al/wp-content/uploads/2025/02/Raport-perfundimtar-i-auditimit-te-ushtruar-ne-Ministrine-e-Shendetesise-dhe-Mbrojtjes-Sociale-1.pdf"
        },
        {
          "kind": "mediatik",
          "label": "Citizens.al - 'Shëndetësia me koncension i kushton miliarda lekë taksapaguesve' (përmbledhje e auditimit KLSH, dhjetor 2022)",
          "url": "https://citizens.al/2022/12/28/raporti-shendetesia-me-koncension-i-kushton-miliarda-leke-taksapaguesve/"
        },
        {
          "kind": "mediatik",
          "label": "Monitor.al - 'Fundi pa lavdi për koncesionet në hetim: buxheti ka dhënë deri tani 335 milionë euro'",
          "url": "https://monitor.al/fundi-pa-lavdi-per-koncesionet-ne-hetim-buxheti-ka-dhene-deri-tani-335-milione-euro/"
        },
        {
          "kind": "mediatik",
          "label": "Transparency International - Health system procurements (Shqipëri): katër koncesionet, ministri Beqaj, hetim për 'abuzim me funksionin'",
          "url": "https://www.transparency.org/en/cepi/cases/health-system-procurements-2"
        },
        {
          "kind": "gjykate",
          "label": "Euronews Albania - GJKKO mbyll shqyrtimin për dosjen 'Sterilizimi'; vendimi shpallet 4 mars 2026",
          "url": "https://euronews.al/gjkko-mbyll-shqyrtimin-per-dosjen-sterilizimi-shpallet-data-kur-jepet-vendimi/"
        }
      ],
      "note": "Shifra kryesore (~5.6 miliardë lekë / 47 milionë euro) është dëm i VLERËSUAR nga auditimi i KLSH-së dhe analiza e shoqërisë civile deri në fund të 2021, jo një humbje e konfirmuar me vendim gjyqësor të formës së prerë; vlera kontraktore (~376 milionë euro) është shumë e ndryshme dhe i referohet investimit/kostos totale të koncesioneve për 10 vjet."
    },
    {
      "id": "check-up-concession-3p-life",
      "sector": "Shëndetësi (koncesion PPP)",
      "year": "2015–2024",
      "value": 138000000,
      "shortTitle": "Koncesioni i Check-Up-it (3P Life Logistic)",
      "title": "Koncesioni i check-up-it bazë shëndetësor (3P Life Logistic)",
      "valueLabel": "Vlera totale e kontratës së koncesionit (13.833 miliardë lekë, ~138 mln euro për 10 vjet)",
      "blurb": "Koncesion 10-vjeçar për check-up-in bazë falas të shtetasve 40–65 vjeç, i firmosur më 7 janar 2015 nga ministri i Shëndetësisë Ilir Beqaj me shoqërinë \"3P Life Logistic\" (e lidhur me sipërmarrësen Vilma Nushi). Vlera e kontratës: 13.833 miliardë lekë (~138 mln euro). Agjencia e Prokurimit Publik refuzoi ta publikonte kontratën duke konstatuar shkelje. KLSH gjeti pagesa për dhjetëra-mijëra check-up-e të papërfunduara dhe TVSH të faturuar padrejtësisht; SPAK hetoi çështjen (procedimi nr. 122/2020), por deri në qershor 2026 nuk ka vendim përfundimtar.",
      "summary": "Më 7 janar 2015, Ministria e Shëndetësisë (ministri Ilir Beqaj) firmosi një kontratë koncesionare 10-vjeçare për kontrollin bazë shëndetësor (check-up) falas të shtetasve 40–65 vjeç, fituar nga shoqëria \"3P Life Logistic\" (80% nga \"Marketing & Distribution\" e Vilma Nushit, 20% nga \"Trimed\"). Sipas dokumenteve të prokurimit, vlera totale e kontratës ishte 13.833.000.000 lekë, ose rreth 138 milionë euro për 10 vjet. Shoqëria 3P Life Logistic ishte themeluar më 9 dhjetor 2014, vetëm një muaj para firmosjes, gjë që ngriti dyshime për fitues të paracaktuar. Agjencia e Prokurimit Publik (APP) refuzoi ta publikonte kontratën, duke konstatuar shkelje serioze ligjore dhe mospërputhje për vlerën e kontratës dhe mënyrën e pagesës.\n\nAuditimi i KLSH-së (raporti i vitit 2018, i pasuar nga gjetje të mëvonshme) konstatoi se koncesionari u pagua për shërbime që nuk i kishte kryer: rreth 801 milionë lekë (~6.5 mln euro) tepricë për periudhën 2015–2018 (rreth 241 mln lekë kosto variabël të parealizuar dhe ~560 mln lekë TVSH e faturuar padrejtësisht, ndonëse shërbimet shëndetësore janë të përjashtuara nga TVSH-ja). Niveli i realizimit të check-up-eve ishte rreth 72% e projeksioneve të kontratës, ndërsa faturimi ishte në masën 100%. Raportime të mëvonshme (komisioni parlamentar, korrik 2024) e cituan dëmin për shërbime të pakryera në rreth 4 milionë euro. Sipas raportimeve hetimore mediatike, kompani të lidhura me familjen Nushi faturuan rreth 28 milionë euro (~40% e faturimit total) drejt koncesionarit.\n\nÇështja kaloi për hetim te SPAK (procedimi nr. 122/2020). Ndër personat e hetuar përmenden ish-ministri Ilir Beqaj dhe sipërmarrësja Vilma Nushi, për akuza si shpërdorim detyre, korrupsion dhe pastrim parash. Kontrata përfundoi më 6 janar 2024. Deri në qershor 2026, hetimi i SPAK-ut ishte ende në fazë paraprake dhe NUK ka vendim gjyqësor përfundimtar (formë e prerë) që të vërtetojë fajësinë. Vendimi i Gjykatës së Posaçme të Apelit i qershorit 2026 lidhej me një çështje shpifjeje (Nushi kundër deputetes Albana Vokshi), jo me një dënim penal për korrupsion.",
      "status": [
        "kontrate",
        "klsh",
        "spak",
        "proces",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Vlera totale e kontratës së koncesionit (10-vjeçar)",
          "value": "13.833.000.000 lekë (~138 milionë euro), firmosur më 7 janar 2015 nga ministri Ilir Beqaj me 3P Life Logistic (Vilma Nushi); kontrata përfundoi më 6 janar 2024",
          "statusKey": "kontrate",
          "source": "Gazeta Standard (investigim, 2026); dokumentet e prokurimit të cituara"
        },
        {
          "label": "Pagesa për shërbime të pakryera (gjetje auditimi)",
          "value": "~801 milionë lekë tepricë për 2015–2018 (~6.5 mln euro): rreth 241 mln lekë kosto variabël të parealizuar + ~560 mln lekë TVSH e faturuar padrejtësisht; realizim ~72% i check-up-eve i faturuar 100%",
          "statusKey": "klsh",
          "source": "Raporti i KLSH-së për Check-Up (2018/2021); Revista Monitor; Gazeta Standard"
        },
        {
          "label": "Hetimi penal (pa vendim përfundimtar)",
          "value": "SPAK, procedimi nr. 122/2020; ndër të hetuarit ish-ministri Ilir Beqaj dhe Vilma Nushi për akuza si shpërdorim detyre, korrupsion e pastrim parash; deri në qershor 2026 ende në fazë paraprake, pa vendim formë e prerë",
          "statusKey": "spak",
          "source": "Pamfleti / Anti-Mafia; Sot News; raportime mediatike 2024–2026"
        },
        {
          "label": "Faturime nga kompani të lidhura (raportim hetimor mediatik)",
          "value": "~28 milionë euro (~40% e faturimit total) të faturuara drejt koncesionarit nga shoqëri të lidhura me familjen Nushi (Marketing & Distribution, Interlogistic, Trimed, Veramentia) — pretendim hetimor, jo i provuar në gjykatë",
          "statusKey": "mediatik",
          "source": "Emisioni 'Plug' / Syri.net; Alfa Press (2026)"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Gazeta Standard – Investigim: Koncesioni i Check-Up me shkelje që në fillim (vlera 13.833 mld lekë / 138 mln euro)",
          "url": "https://www.standard.al/investigimi-koncesioni-i-check-up-me-shkelje-qe-ne-fillim-si-milva-ekonomi-firmosi-nje-kontrate-abuzive/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor – Koncesionari i Check-up ka marrë 6.5 mln euro nga shteti për shërbime që nuk i ka kryer (gjetjet e KLSH)",
          "url": "https://www.monitor.al/koncesionari-i-check-up-ka-marre-6-5-milione-euro-nga-shteti-per-sherbime-qe-nuk-i-ka-kryer/"
        },
        {
          "kind": "mediatik",
          "label": "Top Channel – KLSH gjen 800 mln lekë shkelje te 'Check-Up' dhe 'Sterilizimi' (TVSH e paligjshme)",
          "url": "https://top-channel.tv/2021/11/11/pagesa-te-paligjshme-per-check-up-klsh-gjen-800-mln-leke-shkelje-te-check-up-dhe-sterilizimi/"
        },
        {
          "kind": "mediatik",
          "label": "Pamfleti / Anti-Mafia – Kontrata e 'Check-up' po përfundon; dosja Beqaj–Nushi në SPAK, procedimi nr. 122/2020",
          "url": "https://pamfleti.net/kontrata-e-check-up-po-perfundon-dosja-ilir-beqja-vilma-nushi-3-vite-pezull-ne-spak"
        },
        {
          "kind": "mediatik",
          "label": "Syri.net (Emisioni 'Plug') – Mbi 28 mln euro autofaturime për kompanitë e lidhura me Nushin",
          "url": "https://www.syri.net/plug/898649/detaje-te-reja-nga-afera-e-check-up-mbi-28-mln-euro-autofaturime-per-kompanite-e-lidhura-me-nushin/"
        }
      ],
      "note": "Shifra kryesore (13.833 mld lekë / ~138 mln euro) është VLERA TOTALE e kontratës së koncesionit sipas dokumenteve të prokurimit, jo para të vjedhura: gjetja e auditimit të KLSH-së për shërbime të pakryera është shumë më e vogël (~4–6.5 mln euro) dhe çështja penale e SPAK-ut (procedimi 122/2020) është ende pa vendim përfundimtar."
    },
    {
      "id": "dialysis-concession-diavita-diaverum",
      "sector": "Shëndetësi (PPP / koncesion)",
      "year": "2015–2025",
      "value": 77000000,
      "shortTitle": "Koncesioni i hemodializës (DiaVita)",
      "title": "Koncesioni i hemodializës (DiaVita / Diaverum)",
      "valueLabel": "Vlera e koncesionit 10-vjeçar (~8.6 miliardë lekë / ~86 mln USD ≈ 77 mln euro)",
      "blurb": "Koncesion 10-vjeçar i hemodializës në pesë spitale rajonale, dhënë në 2015 kompanisë DiaVita (Evita + Spitali Amerikan), me vlerë rreth 8.6 miliardë lekë. KLSH ka gjetur pagesa për seanca dialize të pakryera dhe kosto të fryra; SPAK po heton që prej 2023. Koncesioni iu shit suedezes Diaverum në 2019. Pa dënime për këtë koncesion.",
      "summary": "Shërbimi i hemodializës u dha si koncesion/PPP 10-vjeçar nga Ministria e Shëndetësisë në vitin 2015 (shërbimi nisi në 2016), për pacientët me sëmundje renale në pesë qendra pranë spitaleve rajonale të Shkodrës, Lezhës, Korçës, Vlorës dhe Elbasanit. Fitues u shpall kompania DiaVita sh.p.k — krijuar nga Evita sh.p.k (85%) dhe Spitali Amerikan (15%), të lidhura me biznesmenin Klodian Allajbeu. Vlera e raportuar e koncesionit ishte rreth 8.6 miliardë lekë (~86 milionë USD / ~77 milionë euro), me angazhim pagesash nga buxheti deri në vitin 2025.\n\nKontrolli i Lartë i Shtetit (KLSH) ka gjetur se koncesionari paguhej për shërbime të faturuara dhe jo për ato faktikisht të kryera. Sipas KLSH, për periudhën 2016–fund 2020 efekti i financimit të shërbimeve të pakryera vlerësohej në rreth 352 milionë lekë (vetëm në 2020 u regjistruan 3 654 seanca të parealizuara të paguara nga fondet publike). KLSH ka raportuar gjithashtu kosto të fryra — seti i hemodializës u buxhetua rreth 11 200 lekë, ndërsa në tenderin publik kushton rreth 6 100 lekë, pra rreth 45% më shtrenjtë — si dhe mangësi në staf (nefrologë) e pajisje. Organizata \"Së bashku për Jetën / Tok për Jetën\" ka vlerësuar veçmas se koncesioni mori rreth 412 milionë lekë (~3.5 milionë euro) për seanca të pakryera.\n\nNë qershor 2019, 100% e DiaVita-s iu shit kompanisë suedeze Diaverum International AB (Evita 85% + Spitali Amerikan 15%); media e ka raportuar çmimin e shitjes rreth 1.5 milionë euro, shumë e cilësuar pa logjikë ekonomike krahasuar me përfitimet e koncesionit. SPAK po heton koncesionet në shëndetësi që prej 2023; Klodian Allajbeu u thirr në SPAK në shkurt 2025 dhe në janar 2026 u kryen kontrolle te kompania Evita (prokurorja Dorina Bejko). Deri tani nuk ka asnjë dënim të formës së prerë për këtë koncesion; personat e përmendur gëzojnë prezumimin e pafajësisë.",
      "status": [
        "kontrate",
        "klsh",
        "spak",
        "proces",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Vlera e koncesionit 10-vjeçar të hemodializës (Ministria e Shëndetësisë, dhënë 2015, shërbimi nga 2016)",
          "value": "~8.6 miliardë lekë (~86 milionë USD / ~84 milionë euro); angazhim pagesash buxhetore deri në 2025",
          "statusKey": "kontrate",
          "source": "Revista Monitor; Gazeta Telegraf; Mannheimer Swartling (koncesion 10-vjeçar, nëntor 2016)"
        },
        {
          "label": "Pagesa për shërbime hemodialize të pakryera, 2016–fund 2020 (përfshirë 3 654 seanca të parealizuara në 2020)",
          "value": "~352 milionë lekë financim i shërbimeve të pakryera, sipas auditimit të KLSH",
          "statusKey": "klsh",
          "source": "KLSH, cituar nga Reporter.al (BIRN), 25 janar 2022"
        },
        {
          "label": "Kosto e fryrë e setit të hemodializës nën PPP krahasuar me tenderin publik",
          "value": "~11 200 lekë/set nën PPP vs ~6 100 lekë në tenderin publik — rreth 45% më shtrenjtë (KLSH raporton ~43% rritje shpenzimesh)",
          "statusKey": "klsh",
          "source": "KLSH, cituar nga SCAN TV dhe Panorama / sot.com.al"
        },
        {
          "label": "Shitja e 100% të DiaVita kompanisë suedeze Diaverum International AB (Evita 85% + Spitali Amerikan 15%)",
          "value": "Marrëveshje 25 qershor 2019 (Diaverum hyn në treg 2 tetor 2019); çmim i raportuar nga media ~1.5 milionë euro; ~370 pacientë, 5 klinika",
          "statusKey": "mediatik",
          "source": "Mannheimer Swartling; Revista Monitor; VoxNews"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN): PPP-të në Shëndetësi — shqiptarët paguajnë miliona euro për shërbime të pakryera (gjetjet e KLSH, 25.01.2022)",
          "url": "https://www.reporter.al/2022/01/25/ppp-te-ne-shendetesi-shqiptaret-paguajne-miliona-euro-per-sherbime-te-pakryera/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor: Koncesioni i hemodializës u shitet suedezëve — kërkohet miratim nga Konkurrenca (vlera 8.6 mld lekë, shitja te Diaverum)",
          "url": "https://monitor.al/koncesioni-i-hemodializes-u-shitet-suedezeve-kompanite-kerkojne-miratim-nga-konkurrenca/"
        },
        {
          "kind": "mediatik",
          "label": "VoxNews (anglisht): Shitjet seriale të koncesionit të dializës — Diaverum International AB për 1.5 milionë euro",
          "url": "https://www.voxnews.al/english/aktualitet/shitjet-seri-te-koncesionit-te-dializes-po-te-kompanite-qe-kontrollon-i54596"
        },
        {
          "kind": "mediatik",
          "label": "Top Channel: Koncesionet në shëndetësi — Klodian Allajbeu thirret në SPAK (24.02.2025)",
          "url": "https://top-channel.tv/2025/02/24/koncesionet-ne-shendetesi-thirret-ne-spak-klodian-allajbeu/"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com: SPAK kontrolle te kompania Evita e lidhur me Klodian Allajbeun (prokurorja Dorina Bejko, janar 2026)",
          "url": "https://shqiptarja.com/lajm/spak-operacion-kontrolle-te-kompania-evita-e-klodian-allajbeut"
        }
      ],
      "note": "Vlera kryesore (~8.6 mld lekë / ~86 mln USD) është vlera totale e kontratës së koncesionit, jo shumë e provuar e vjedhur; shuma e parregullsive të gjetura nga auditimi i KLSH (~352 mln lekë për shërbime të pakryera 2016–2020) është dukshëm më e vogël, ndërsa shifra ~412 mln lekë i përket vlerësimit të një OJF-je (\"Së bashku për Jetën\"), jo KLSH-së."
    },
    {
      "id": "laboratory-network-concession",
      "sector": "Shëndetësi — Partneritet Publik-Privat (PPP/koncesion)",
      "year": "2019–2028",
      "value": 106000000,
      "shortTitle": "Koncesioni i laboratorëve (Laboratory Network)",
      "title": "Koncesioni i shërbimeve laboratorike spitalore (Laboratory Network)",
      "valueLabel": "Vlera e parashikuar e kontratës së koncesionit për 10 vjet (~13 miliardë lekë)",
      "blurb": "Koncesioni i shërbimeve laboratorike spitalore u nënshkrua më 24 prill 2019 dhe i kaloi për 10 vjet një konsorciumi privat (Labopharma, Exalab e AB Laboratory Solutions) rrjetin e laboratorëve të spitaleve publike. Ndaj një investimi të premtuar prej vetëm ~13 milionë eurosh, buxheti i shtetit parashikohet të paguajë rreth 106 milionë euro (≈13 miliardë lekë) gjatë 10 viteve, duke e bërë atë paguesin më të madh ndër PPP-të shëndetësore. KLSH e cilësoi dhënien e koncesionit në kundërshtim me ligjin dhe kallëzoi zyrtarët në SPAK; hetimi i SPAK është ende në proces, pa vendim përfundimtar.",
      "summary": "Më 24 prill 2019 Ministria e Shëndetësisë (nënshkrim nga zëvendëskryeministri Erion Braçe) i dha me koncesion 10-vjeçar shërbimet laboratorike të rrjetit të spitaleve publike (5 spitale universitare dhe ~13 spitale rajonale/bashkiake, përfshirë Sarandën e Lushnjën) një konsorciumi: Labopharma (41,7%), AB Laboratory Solutions B.V. me seli në Hagë, Holandë (33,3%) dhe Exalab nga Franca (25%). Shoqëria koncesionare \"Laboratory Networks\" sh.p.k. u regjistrua më 19 qershor 2019 — pra rreth 3 muaj PAS nënshkrimit të kontratës. Sipas Regjistrit të Pronarëve Përfitues dhe hetimeve mediatike, kontrolli përfundimtar i takon biznesmenit Janis (Jani) Karathano — pronar i kompanisë farmaceutike Pegasus — i cili zotëron 100% të Labopharma-s dhe kontrollon edhe kompaninë holandeze AB Laboratory Solutions, duke kapur rreth 75% të konsorciumit (53,85% sipas regjistrit zyrtar të pronarëve përfitues). Përballë një investimi të premtuar prej vetëm ~13 milionë eurosh, vlera e kontratës është ~13 miliardë lekë ose rreth 106 milionë euro (disa burime: ~104 milionë) për 10 vjet, që e bën koncesionin paguesin më të madh ndër PPP-të shëndetësore. Pagesat vjetore nga buxheti u rritën nga 1,26 miliardë lekë (2021) në 1,55 miliardë (2022) dhe ~1,72–1,73 miliardë lekë (2023). KLSH konstatoi se koncesioni u dha në kundërshtim me ligjin \"Për koncesionet/PPP\", se komisioni shpërfilli kundërshtimet e IFC-së (një kompani ishte nën hetim penal në Spanjë dhe një tjetër pa të drejtat e nevojshme të votës), dhe llogariti një kosto shtesë prej ~3,3 milionë euro/vit (deri ~33 milionë euro shtesë gjatë kontratës). KLSH kallëzoi në SPAK 7–10 zyrtarë të Ministrisë së Shëndetësisë (janar 2022) dhe i kërkoi ministrisë rishikimin/zgjidhjen e kontratës. Në 2024 SPAK dhe BKH kryen kontrolle e sekuestrime në Pegasus, Labopharma, AB Laboratory Solutions dhe Spitalin Amerikan/Klodjan Allajbeun, me të paktën 9 kërkesa për kthim sendesh në GJKKO. Hetimi mbetet në proces; nuk ka asnjë vendim gjyqësor të formës së prerë dhe vlen prezumimi i pafajësisë.",
      "status": [
        "kontrate",
        "klsh",
        "spak",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera e kontratës së koncesionit (10-vjeçare)",
          "value": "~13 miliardë lekë / rreth 106 milionë euro (disa burime ~104 milionë euro); investim i premtuar nga privati vetëm ~13 milionë euro",
          "statusKey": "kontrate",
          "source": "Monitor.al / KLSH (raporti i auditimit), Revista Monitor"
        },
        {
          "label": "Pagesat vjetore nga buxheti",
          "value": "1,26 miliardë lekë (2021) → 1,55 miliardë (2022) → ~1,72–1,73 miliardë lekë (2023); paguesi më i madh ndër PPP-të shëndetësore",
          "statusKey": "zyrtar",
          "source": "Revista Monitor (të dhëna buxhetore dhe bilancet pranë QKB)"
        },
        {
          "label": "Gjetjet e auditimit të KLSH",
          "value": "Koncesion i dhënë në kundërshtim me ligjin për PPP; kosto shtesë ~3,3 milionë euro/vit (deri ~33 milionë euro shtesë); kundërshtimet e IFC u shpërfillën (një kompani nën hetim penal në Spanjë)",
          "statusKey": "klsh",
          "source": "KLSH / Reporter.al, Monitor.al"
        },
        {
          "label": "Statusi penal",
          "value": "KLSH kallëzoi 7–10 zyrtarë të Ministrisë së Shëndetësisë në SPAK (jan. 2022); në 2024 SPAK/BKH kryen kontrolle e sekuestrime te Pegasus, Labopharma, AB Laboratory Solutions e Spitali Amerikan. Hetim në proces, pa vendim përfundimtar — prezumimi i pafajësisë",
          "statusKey": "spak",
          "source": "SPAK (raportuar nga Zëri i Amerikës, Shqiptarja.com, Sot.com.al)"
        }
      ],
      "sources": [
        {
          "kind": "klsh",
          "label": "Reporter.al — KLSH padit zyrtarët e Ministrisë së Shëndetësisë për koncesionin e laboratorëve (kallëzimi në SPAK, kundërshtimet e IFC)",
          "url": "https://www.reporter.al/2022/01/26/klsh-padit-zyrtaret-e-ministrise-se-shendetesise-per-koncesionin-e-laboratoreve/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Laboratorët me PPP, KLSH zbulon 3.3 milionë euro kosto shtesë në vit (vlera ~106 mln euro, nënshkrimi 24 prill 2019)",
          "url": "https://www.monitor.al/laboratoret-me-ppp-klsh-zbulon-3-3-milione-euro-kosto-shtese-ne-vit-2/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Koncesionet po rezultojnë 'pa lavdi' (të ardhura 1,55 mld lekë 2022; vlera 13 mld lekë / 106 mln euro; afati 2028)",
          "url": "https://monitor.al/koncesionet-po-rezultojne-pa-lavdi-por-fundi-nuk-po-u-duket-2/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Regjistri i Pronarëve Përfitues (Karathano 53,85%; struktura e aksioneve Labopharma/AB Laboratory Solutions/Exalab)",
          "url": "https://www.monitor.al/regjistri-i-pronareve-perfitues-zbardhen-njerezit-qe-qendrojne-pas-koncesioneve/"
        },
        {
          "kind": "mediatik",
          "label": "Zëri i Amerikës — Koncesioni i laboratorëve mjekësorë nën hetim për korrupsion (kallëzimi i KLSH-së, kërkesa për zgjidhjen e kontratës)",
          "url": "https://www.zeriamerikes.com/a/6641517.html"
        }
      ],
      "note": "Shifra kryesore (~106 milionë euro) është vlera e PARASHIKUAR e kontratës 10-vjeçare (paratë publike që shteti angazhohet të paguajë), jo një dëm i konfirmuar nga gjykata apo një shumë e vjedhur; KLSH dhe SPAK kanë gjetje e hetime në proces, por nuk ka vendim të formës së prerë."
    },
    {
      "id": "balluku-llogara-unaza-tenders",
      "sector": "Rrugë dhe tunele / Prokurime publike",
      "year": "2020–2026",
      "value": 190000000,
      "shortTitle": "Balluku – Tuneli i Llogarasë & Unaza e Madhe",
      "title": "Tenderët e infrastrukturës së Belinda Ballukut: Tuneli i Llogarasë dhe Unaza e Madhe e Tiranës",
      "valueLabel": "Vlera e tenderit të Tunelit të Llogarasë (rreth 18,97 mld lekë pa TVSH ≈ 190 mln euro)",
      "blurb": "Zëvendëskryeministrja dhe ministrja e Infrastrukturës, Belinda Balluku, u mor e pandehur nga SPAK në tetor 2025 dhe u pezullua nga detyra në nëntor 2025, e akuzuar për \"shkelje të barazisë së pjesëmarrësve në tendera\" për tenderin ~190 mln euro të Tunelit të Llogarasë dhe për shtatë tenderë të Unazës së Madhe të Tiranës. Pranë saj janë marrë të pandehur edhe drejtues të ARRSH-së. Çështja është në hetim/gjykim – nuk ka vendim përfundimtar fajësie.",
      "summary": "Prokuroria e Posaçme (SPAK) hetoi tenderët e mëdhenj të infrastrukturës nën përgjegjësinë e zëvendëskryeministres dhe ministres së Infrastrukturës e Energjisë, Belinda Balluku. Më 31 tetor 2025, SPAK e mori të pandehur Ballukun për veprën penale \"shkelje e barazisë së pjesëmarrësve në tendera apo ankande publike\" (nenet 258/2 dhe 25 të Kodit Penal, e dënueshme me 1–5 vjet). Hetimi përqendrohet te tenderi i Tunelit të Llogarasë me vlerë rreth 18,97 miliardë lekë pa TVSH (≈190 mln euro) dhe te shtatë tenderët e Unazës së Madhe të Tiranës, përfshirë Lotin 4 (~2 mld lekë / ~20 mln euro) të fituar nga bashkimi i operatorëve \"Euroteorema\", \"Pevlaku\" dhe \"NOVA Construction\". Sipas SPAK, fituesit u \"paracaktuan\" duke u dhënë avantazhe të padrejta përmes koordinimit me komisionet e vlerësimit. Te tenderi i Llogarasë, sipas raportimeve mediatike, fituesi i parë \"Gjoka Konstruksion\" (ofertë ~140 mln euro) u skualifikua dhe pas rishpalljes (qershor 2021) fitoi bashkimi \"INTEKAR–ASL\" me ~190 mln euro, ndërsa punimet pretendohet të nënkontraktoheshin sërish te \"Gjoka\", duke u pretenduar një dëm i mundshëm ~50 mln euro – ky shifër mbetet pretendim hetimor, jo dëm i provuar nga gjykata. Më 19–20 nëntor 2025, Gjykata e Posaçme e pezulloi Ballukun nga detyra dhe i vendosi ndalim daljeje nga vendi; drejtori i ARRSH-së Gentian Gjyli dhe administratori i KESH-it Erald Elezi u vunë në arrest shtëpie; u morën të pandehur edhe ish-drejtori i ARRSH-së Evis Berberi e zyrtarë të tjerë prokurimi. Më 16 dhjetor 2025 SPAK i kërkoi Kuvendit autorizim për arrestimin e Ballukut. Më 26 shkurt 2026, kryeministri Edi Rama e shkarkoi Ballukun nga qeveria. Më 11 mars 2026, Kuvendi me shumicë socialiste votoi kundër heqjes së imunitetit dhe arrestimit (82 kundër, 47 pro), duke shkaktuar reagime nga BE-ja; SPAK paralajmëroi ankim. Çështja vijon pa vendim përfundimtar.",
      "status": [
        "spak",
        "proces",
        "kontrate",
        "mediatik",
        "gjykate"
      ],
      "facts": [
        {
          "label": "Vlera e tenderit të Tunelit të Llogarasë",
          "value": "≈18,97 mld lekë pa TVSH (≈190 mln euro / ~219 mln USD); fituar pas rishpalljes nga bashkimi INTEKAR–ASL",
          "statusKey": "kontrate",
          "source": "Albanian Times / OCCRP / Balkanweb"
        },
        {
          "label": "Akuza ndaj Belinda Ballukut",
          "value": "\"Shkelje e barazisë së pjesëmarrësve në tendera apo ankande publike\" (nenet 258/2 dhe 25 të K.Penal), e dënueshme 1–5 vjet; e pandehur më 31 tetor 2025",
          "statusKey": "spak",
          "source": "OCCRP / Albanian Times"
        },
        {
          "label": "Masat e sigurisë (nëntor 2025)",
          "value": "Balluku: pezullim nga detyra + ndalim daljeje nga vendi; Gentian Gjyli (ARRSH) dhe Erald Elezi (KESH): arrest shtëpie; të pandehur edhe Evis Berberi e zyrtarë prokurimi",
          "statusKey": "gjykate",
          "source": "Gjykata e Posaçme / OCCRP / Balkanweb"
        },
        {
          "label": "Pretendimi për dëm te Tuneli i Llogarasë",
          "value": "~50 mln euro dëm i mundshëm (oferta e parë ~140 mln euro u skualifikua; punimet u nënkontraktuan te Gjoka) – pretendim hetimor, jo dëm i provuar nga gjykatë",
          "statusKey": "mediatik",
          "source": "Balkanweb (raportim mediatik)"
        }
      ],
      "sources": [
        {
          "kind": "klsh",
          "label": "OCCRP – Shqipëria pezullon zv/kryeministren Balluku në hetim të madh tenderësh",
          "url": "https://www.occrp.org/en/news/albania-suspends-deputy-pm-balluku-in-major-tender-probe"
        },
        {
          "kind": "gjykate",
          "label": "Balkan Insight – Gjykata e Posaçme pezullon zv/kryeministren shqiptare",
          "url": "https://balkaninsight.com/2025/11/20/albanian-special-court-suspends-deputy-prime-minister-source/"
        },
        {
          "kind": "mediatik",
          "label": "Balkanweb – Akuza të reja për Unazën e Madhe (Euroteorema, Pevlaku, NOVA Construction)",
          "url": "https://www.balkanweb.com/en/spak-new-charges-for-ballukun-big-ring-road-tender-how-they-gained-20-million-euros-euroteorema-pevlaku-and-nova-construction-what-prosecutors-discovered/"
        },
        {
          "kind": "mediatik",
          "label": "Albanian Times – SPAK e shpall Ballukun të pandehur për tenderin e Tunelit të Llogarasë (31 tetor 2025)",
          "url": "https://albaniantimes.al/spak-names-deputy-pm-balluku-as-official-suspect-over-llogara-tunnel-tender/"
        },
        {
          "kind": "mediatik",
          "label": "European Western Balkans – Kuvendi bllokon arrestimin e ish-zv/kryeministres (11 mars 2026)",
          "url": "http://europeanwesternbalkans.com/2026/03/12/parliament-of-albania-blocks-the-arrest-of-the-indicted-former-deputy-prime-minister/"
        }
      ],
      "note": "Shifra kryesore (~190 mln euro) është VLERA e tenderit/kontratës së Tunelit të Llogarasë nën hetim nga SPAK, jo para të vjedhura apo dëm i provuar; vlen prezumimi i pafajësisë – nuk ka ende vendim gjyqësor të formës së prerë."
    },
    {
      "id": "unaza-e-madhe-astir",
      "sector": "Rrugë dhe infrastrukturë urbane",
      "year": "2013–2025",
      "value": 450000000,
      "shortTitle": "Unaza e Madhe & Astir",
      "title": "Unaza e Madhe e Tiranës dhe shpronësimet e Astirit: shtatë lote tenderësh nën hetim nga SPAK",
      "valueLabel": "Vlera e prokurimit të Unazës së Madhe (≈45.9 miliardë lekë), sipas raportimit të BIRN-it",
      "blurb": "Unaza e Madhe e Tiranës — rreth 28.7 km e prokuruar për afërsisht 45.9 miliardë lekë (≈450 milionë euro) — është nën hetim nga SPAK për shtatë lote tenderësh ku dyshohet se fituesit ishin paracaktuar. Zëvendëskryeministrja dhe ministrja Belinda Balluku u mor e pandehur më 31 tetor 2025. Paralelisht qëndron kontesti i shpronësimeve të Astirit/Yzberishtit, ku banorët ankohen për vlerësime të ulëta.",
      "summary": "Unaza e Madhe (Unaza e Jashtme) e Tiranës është një program rrugor prej rreth 28.7 km i ndarë në shumë lote, i prokuruar sipas raportimit të BIRN-it për rreth 45.9 miliardë lekë (≈450 milionë euro) gjatë periudhës 2011–2024. SPAK po heton shtatë lotet e tenderuara më 15 shtator 2021, duke dyshuar se fituesit u paracaktuan: nga 48 kompani pjesëmarrëse, 35 u skualifikuan, dhe gjashtë nga shtatë lotet u fituan me oferta nga 94.5% deri në 96.1% të fondit limit. Sipas akuzës së SPAK-ut, ministrja Belinda Balluku u dha udhëzime drejtorit të ARRSH-së, Evis Berberi, përfshirë imponimin e bashkimit të kompanisë \"Nova Construction 2012\" të Ilir Shtufit me \"Euroteorema Peqin\" (EUT) — një firmë e raportuar me lidhje me familjen Berisha. Balluku u mor e pandehur më 31 tetor 2025 për \"shkelje të barazisë së pjesëmarrësve në tendera\", lidhur me tunelin e Llogarasë (190 mln euro pa TVSH) dhe Lotin 4 të Unazës së Madhe (20 mln euro pa TVSH). GJKKO e pezulloi nga detyra më 19 nëntor 2025, ndërsa Gjykata Kushtetuese e riktheu më 12 dhjetor 2025. Asnjë vendim përfundimtar nuk ekziston; vlen prezumimi i pafajësisë. Çështja e dytë, e shpronësimeve të Astirit/Yzberishtit, daton që nga protestat e 2018-ës: banorët akuzuan qeverinë për standarde të dyfishta dhe vlerësime të ulëta të pronave, me rreth 200 ankesa pranë Avokatit të Popullit dhe hetim të Komitetit Shqiptar të Helsinkit për diskriminim. Qeveria dalloi mes pronarëve me dokumente (që shpronësoheshin) dhe atyre pa leje (3 vjet qira). Pretendimi se shtëpitë u vlerësuan me çmime të vitit 2013 ndërsa pronarë toke të lidhur morën çmime tregu është kryesisht kuadër mediatik/politik, jo i konfirmuar me auditim.",
      "status": [
        "spak",
        "proces",
        "kontrate",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Vlera totale e prokurimit të Unazës së Madhe (≈28.7 km, 2011–2024)",
          "value": "≈45.9 miliardë lekë (≈450 milionë euro), sipas raportimit të BIRN-it",
          "statusKey": "kontrate",
          "source": "BIRN / Reporter.al (rimarrë nga Sot.com.al)"
        },
        {
          "label": "Shtatë lotet e tenderuara më 15.09.2021 nën hetim",
          "value": "Nga 48 kompani pjesëmarrëse, 35 u skualifikuan; 6 nga 7 lotet u fituan me 94.5%–96.1% të fondit limit",
          "statusKey": "spak",
          "source": "Shqiptarja.com (Dosja Balluku)"
        },
        {
          "label": "Belinda Balluku e pandehur (31 tetor 2025) për 'shkelje të barazisë në tendera'",
          "value": "Lidhur me tunelin e Llogarasë (190 mln euro pa TVSH) dhe Lotin 4 të Unazës (20 mln euro pa TVSH); pezulluar nga GJKKO (19.11.2025), rikthyer nga Kushtetuesja (12.12.2025)",
          "statusKey": "proces",
          "source": "Shqiptarja.com"
        },
        {
          "label": "Shpronësimet e Astirit/Yzberishtit — ankesa e banorëve për vlerësime të ulëta",
          "value": "≈200 ankesa pranë Avokatit të Popullit; pretendim për standarde të dyfishta; hetim i Komitetit Shqiptar të Helsinkit për diskriminim (2018)",
          "statusKey": "mediatik",
          "source": "Reporter.al / Porta Vendore"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN): 'Unaza e Madhe, konkurrenca e vogël: Për çfarë akuzohet Belinda Balluku'",
          "url": "https://www.reporter.al/2025/11/24/unaza-e-madhe-konkurrenca-e-vogel-per-cfare-akuzohet-belinda-balluku/"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com: 'Dosja Balluku / Në sitë e gjithë Unaza e Madhe — SPAK dyshon se u paracaktuan fituesit për 7 lotet'",
          "url": "https://shqiptarja.com/lajm/dosja-balluku-spak-ne-verifikim-te-gjithe-tenderet-per-7-lotet-e-unazes-se-madhe-dyshime-se-u-paracaktuan-fituesit-priten-te-tjere-te-pandehur"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com: 'Pas Llogarasë, Balluku nën hetim edhe për Unazën e Madhe — GJKKO e pezullon nga detyra'",
          "url": "https://shqiptarja.com/lajm/u-mor-e-pandehur-pwr-tunelin-e-llogarasw-gjkko-pezullon-nga-detyra-zvkryeministren-balluku-e-ndalon-te-dale-jashte-vendit"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com: 'Dosja e Unazës së Madhe — Balluku i imponon ortakun (EUT), kriteret si kostum për fituesit'",
          "url": "https://shqiptarja.com/lajm/tenderi-per-unazen-e-madhe-balluku-kusht-biznesit-te-lidhur-me-familjen-berisha-urdheron-berberin-beja-te-qarte-shtufnit-se-e-fiton-vetem-nese-bashkohet-me-eutne"
        },
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN, 2018): 'Të prerë në besë — banorët e Unazës së Re akuzojnë qeverinë për standarde të dyfishta'",
          "url": "https://www.reporter.al/2018/11/13/te-prere-ne-bese-banoret-e-unazes-se-re-akuzojne-qeverine-per-standarde-te-dyfishta/"
        }
      ],
      "note": "Shifra titulluese (≈450 mln euro / ≈45.9 mld lekë) është vlerë e agreguar prokurimi e raportuar nga BIRN-i, jo dëm i audituar e as shumë e provuar e vjedhur; çmimet për km dhe pretendimet për Astirin janë gazetareske/politike dhe jo të konfirmuara me auditim apo vendim gjyqësor."
    },
    {
      "id": "becchetti-hydro-icsid-arb-15-28",
      "sector": "Energji hidrike (HEC Kalivaç) dhe media (Agonset / Agon Channel) — arbitrazh ndërkombëtar i investimeve",
      "year": "2015–2025",
      "value": 99487000,
      "shortTitle": "Becchetti — Arbitrazhi ICSID (Agonset/Kalivaç)",
      "title": "Hydro S.r.l. & Becchetti kundër Shqipërisë — ICSID ARB/15/28 (Agonset / Kalivaç)",
      "valueLabel": "Dëmshpërblim i caktuar nga arbitrazhi ICSID (detyrim i konfirmuar i shtetit)",
      "blurb": "Tribunali i ICSID-it (Çështja ARB/15/28) e gjeti Shqipërinë përgjegjëse për shpronësimin e paligjshëm të investimit mediatik Agonset (Agon Channel), duke i caktuar investitorëve italianë rreth 99,49 milionë euro dëmshpërblim plus rreth 8,22 milionë euro shpenzime. Kërkesat për HEC-in e Kalivaçit u rrëzuan. Vendimi mbeti në fuqi pas refuzimit të anulimit (2021) dhe procedurave franceze; Becchetti po e ekzekuton përmes gjykatave të Brukselit duke bllokuar tarifat e fluturimit të Albcontrol-it pranë Eurocontrol-it (rreth 135 milionë euro deri në fund të 2024).",
      "summary": "Çështja Hydro S.r.l., Costruzioni S.r.l., Francesco Becchetti, Mauro De Renzis, Stefania Grigolon dhe Liliana Condomitti kundër Republikës së Shqipërisë (ICSID Nr. ARB/15/28) u regjistrua më 10 qershor 2015 në bazë të Traktatit Dypalësh të Investimeve Itali–Shqipëri. Investitorët pretenduan se autoritetet shqiptare, gjatë 2014–2015, ndërmorën një fushatë të motivuar politikisht kundër bizneseve të Becchettit — auditime tatimore, hetime penale, sekuestrime asetesh, bllokim llogarish dhe mbylljen e Agon Channel/Agonset — pas kritikave të kanalit ndaj qeverisë.\n\nMe vendimin (Award) e datës 24 prill 2019, tribunali e gjeti Shqipërinë përgjegjëse vetëm për shpronësimin e paligjshëm të investimit mediatik Agonset, në kundërshtim me nenin 5 të traktatit, duke konkluduar se veprimet ishin ndërhyrje e qëllimshme e shtytur nga kritikat e Agonset-it ndaj qeverisë dhe jo ushtrim legjitim i pushtetit policor të shtetit. Dëmshpërblimi u nda mes mbajtësve të interesave në Agonset: Mauro De Renzis 46.751.000 euro, Francesco Becchetti 41.048.000 euro dhe Stefania Grigolon 11.688.000 euro — gjithsej rreth 99.487.000 euro, plus interes (LIBOR + 3%). Tribunali rrëzoi të gjitha pretendimet që lidheshin me projektin hidroenergjetik të Kalivaçit, duke vlerësuar se investitorët e kishin braktisur vullnetarisht projektin që në qershor 2014 për shkak vështirësish financimi, përpara veprimeve të pretenduara të shtetit. Shqipërisë iu ngarkua edhe rreth 8.222.238,53 euro (75% e shpenzimeve ligjore të paditësve) dhe rreth 645.183,42 USD shpenzime arbitrazhi.\n\nShqipëria kërkoi anulimin e vendimit sipas nenit 52 të Konventës ICSID; komiteti ad hoc e rrëzoi kërkesën më 2 prill 2021, duke e lënë vendimin në fuqi. Përpjekjet pasuese të shtetit (kërkesa për rishikim dhe procedura para Gjykatës së Apelit të Parisit) gjithashtu nuk patën sukses. Në mungesë të pagesës vullnetare nga shteti, paditësit nisën ekzekutimin jashtë vendit: gjykatat e Brukselit lejuan bllokimin/sekuestrimin e tarifave të fluturimit (en route dhe terminal) që Albcontrol-it i mban Eurocontrol-i. Sipas raportimeve, shuma e pambledhur nga Albcontrol-i u rrit nga 607 milionë lekë në fund të 2020 në rreth 13,5 miliardë lekë (rreth 135 milionë euro) në fund të 2024, duke detyruar qeverinë shqiptare të mbështesë financiarisht Albcontrol-in me kredi shtetërore. Ky mbetet një nga detyrimet më të mëdha të konfirmuara të shtetit shqiptar në arbitrazhin ndërkombëtar të investimeve.",
      "status": [
        "arbitrazh",
        "gjykate",
        "zyrtar",
        "proces"
      ],
      "facts": [
        {
          "label": "Dëmshpërblim i caktuar nga tribunali ICSID për shpronësimin e Agonset-it",
          "value": "99.487.000 euro (De Renzis 46.751.000 + Becchetti 41.048.000 + Grigolon 11.688.000), plus interes LIBOR+3%; Award i datës 24 prill 2019",
          "statusKey": "arbitrazh",
          "source": "italaw (ICSID ARB/15/28) dhe UNCTAD Investment Policy Hub"
        },
        {
          "label": "Shpenzime të ngarkuara Shqipërisë",
          "value": "Rreth 8.222.238,53 euro (75% e shpenzimeve ligjore të paditësve) plus rreth 645.183,42 USD shpenzime arbitrazhi",
          "statusKey": "arbitrazh",
          "source": "italaw, përmbledhja e vendimit ICSID ARB/15/28"
        },
        {
          "label": "Anulimi i kërkuar nga Shqipëria — i rrëzuar; vendimi mbetet në fuqi",
          "value": "Komiteti ad hoc i ICSID-it e rrëzoi kërkesën për anulim më 2 prill 2021; kërkesa për rishikim dhe procedurat para Gjykatës së Apelit të Parisit gjithashtu dështuan (2025)",
          "statusKey": "gjykate",
          "source": "jusmundi (Decision on Annulment, 2 prill 2021); Global Arbitration Review (Paris)"
        },
        {
          "label": "Ekzekutimi përmes Brukselit — bllokim i tarifave të fluturimit të Albcontrol pranë Eurocontrol",
          "value": "Shuma e pambledhur nga Albcontrol-i arriti rreth 135 milionë euro (13,5 miliardë lekë) deri në fund të 2024; qeveria detyrohet të mbështesë Albcontrol-in me kredi shtetërore",
          "statusKey": "proces",
          "source": "monitor.al / hashtag.al / Tirana Times (raportim mbi ekzekutimin në Bruksel)"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "italaw — Hydro S.r.l. and others v. Republic of Albania (I), ICSID ARB/15/28 (dokumentet e çështjes)",
          "url": "https://www.italaw.com/cases/3958"
        },
        {
          "kind": "gjykate",
          "label": "jusmundi — Vendimi për Anulimin (Decision on Annulment), 2 prill 2021",
          "url": "https://jusmundi.com/en/document/decision/en-hydro-s-r-l-costruzioni-s-r-l-francesco-becchetti-mauro-de-renzis-stefania-grigolon-liliana-condomitti-v-republic-of-albania-decision-on-annulment-friday-2nd-april-2021"
        },
        {
          "kind": "gjykate",
          "label": "jusmundi — Vendimi i Gjykatës së Apelit të Brukselit për sekuestrimin e aseteve, 15 maj 2023",
          "url": "https://jusmundi.com/en/document/decision/en-hydro-s-r-l-costruzioni-s-r-l-francesco-becchetti-mauro-de-renzis-stefania-grigolon-liliana-condomitti-v-republic-of-albania-judgment-of-the-brussels-court-of-appeal-on-attachement-of-assets-monday-15th-may-2023"
        },
        {
          "kind": "mediatik",
          "label": "monitor.al — Becchetti i bllokon Albcontrol-it 135 mln euro për arbitrazhin",
          "url": "https://monitor.al/en/becchetti-i-bllokon-albcontrol-135-mln-euro-per-arbitrazhin-nuk-shlyhet-as-huaja-74-mln-euro/"
        },
        {
          "kind": "mediatik",
          "label": "Tirana Times — Taksapaguesit shqiptarë mbështesin Albcontrol-in pas sekuestrimit nga gjykata belge",
          "url": "https://www.tiranatimes.com/becchetti-gets-paid-as-albanian-taxpayers-bail-out-air-traffic-control-company-whose-foreign-accounts-were-seized-by-belgian-court/"
        }
      ],
      "note": "Shifra kryesore (99.487.000 euro) është dëmshpërblim i caktuar nga arbitrazhi — detyrim i konfirmuar i shtetit për shpronësimin e Agonset-it, jo \"dëm\" i provuar penalisht; ekzekutimi (rreth 135 mln euro tarifa të bllokuara të Albcontrol) është shumë e veçantë nga dëmshpërblimi bazë dhe pasqyron interesa e shpenzime ekzekutimi."
    },
    {
      "id": "durres-yachts-marina-eagle-hills",
      "sector": "Porte / rizhvillim imobiliar bregdetar (investim strategjik)",
      "year": "2022–2026",
      "value": 2000000000,
      "shortTitle": "Durrës Yachts & Marina (Eagle Hills)",
      "title": "Rizhvillimi \"Durrës Yachts & Marina\" (Eagle Hills / Mohamed Alabbar)",
      "valueLabel": "Vlera e shpallur e investimit të projektit (~2 miliardë euro)",
      "blurb": "Marrëveshje kuadër e nënshkruar më 30 janar 2023 që i jep statusin \"investitor strategjik\" projektit ~2 miliardë euro për transformimin e portit të Durrësit. Eagle Hills (Mohamed Alabbar, EAU) zotëron 67% dhe shoqëria shtetërore ASDC 33%. Shteti i transferoi shoqërisë 281 prona publike (~818 mijë m², ~81 ha). Projekti është kritikuar për mungesë transparence, mungesë gare ndërkombëtare dhe vlerësim të dyshimtë të aseteve publike; sipas bilancit të vitit 2023, shoqëria arkëtoi ~22 milionë euro nga shitja e apartamenteve \"në ajër\" pa nisur ndërtimi. Nuk ka vendim penal të formës së prerë.",
      "summary": "Projekti \"Durrës Yachts & Marina\" synon shndërrimin e portit aktual të Durrësit në një kompleks rezidencial-turistik me ~13 mijë apartamente, mbi 850 dhoma hoteli dhe 280 vendqëndrime jahtesh. Marrëveshja kuadër u nënshkrua midis Këshillit të Ministrave, Eagle Hills Real Estate Development dhe Albanian Seaports Development Company (ASDC) më 30 janar 2023, me status \"investitor strategjik\" për 20 vjet. Struktura e pronësisë: Eagle Hills 67%, ASDC (palë shtetërore) 33%. Në shkurt 2023 shteti transferoi te shoqëria 281 prona shtetërore me sipërfaqe ~818 mijë m² (rreth 81 hektarë). Të ardhurat e projektuara janë ~3.2 miliardë euro për 35 vjet, ku ~2.26 miliardë euro (70%) priten nga shitja e apartamenteve. Sipas Monitor.al, që citon bilancin e shoqërisë për 2023, ishin arkëtuar ~22 milionë euro (2.2 miliardë lekë, zëri \"Detyrime nga kontratat me klientë\") nga parashitja e apartamenteve \"në ajër\", ndërsa ndërtimi sapo kishte nisur; shifra kumulative arriti ~42 milionë euro deri në fund të 2024. Projekti është kontestuar nga opozita (37 deputetë e cilësuan \"mega-korrupsion\"; Gjykata Kushtetuese i rrëzoi ankimet), nga Komisioni Europian (komisioneri Várhelyi kërkoi transparencë dhe konkurrencë) dhe nga ekonomistë si Pano Soko, që ngrenë shqetësime për nënvlerësimin e aseteve publike (rreth 1 milion m² me vlerë të mundshme 100–150 euro/m²) dhe mungesën e garës ndërkombëtare. Në maj 2026, IKMT konfirmoi ulje (subsidencë) të dy godinave në ndërtim (godina 02: ~28 cm; godina 04: ~18 cm) dhe sipas mediave Prokuroria e Durrësit nisi hetime. Nuk ka vendim gjyqësor të formës së prerë dhe asnjë akuzë e provuar.",
      "status": [
        "kontrate",
        "proces",
        "mediatik",
        "zyrtar"
      ],
      "facts": [
        {
          "label": "Vlera e shpallur e investimit / struktura e pronësisë",
          "value": "Marrëveshje kuadër e nënshkruar më 30 janar 2023; investim ~2 miliardë euro; Eagle Hills 67%, ASDC (shtet) 33%; status investitor strategjik për 20 vjet.",
          "statusKey": "kontrate",
          "source": "Kryeministria.al / Monitor.al"
        },
        {
          "label": "Asetet publike të transferuara",
          "value": "Në shkurt 2023 shteti transferoi te shoqëria 281 prona shtetërore me sipërfaqe ~818 mijë m² (rreth 81 hektarë) të portit të Durrësit.",
          "statusKey": "kontrate",
          "source": "Monitor.al (bazuar te dokumentet/bilanci)"
        },
        {
          "label": "Arkëtime nga parashitja \"në ajër\" (2023)",
          "value": "~22 milionë euro (2.2 miliardë lekë), zëri \"Detyrime nga kontratat me klientë\", të arkëtuara në 2023 pa nisur ndërtimi; ~42 milionë euro kumulative deri në fund 2024.",
          "statusKey": "mediatik",
          "source": "Monitor.al (bilanci 2023 dhe 2024 i shoqërisë)"
        },
        {
          "label": "Shqetësim për vlerësimin e aseteve / subsidenca 2026",
          "value": "Ekonomistë dhe OBCT ngrenë dyshime për nënvlerësim të tokës publike dhe mungesë gare; në maj 2026 IKMT konfirmoi ulje të dy godinave (28 cm dhe 18 cm) dhe sipas mediave nisi hetim prokurorial. Pa vendim të formës së prerë.",
          "statusKey": "proces",
          "source": "OBCT / Reporter.al / Albanian Daily News"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "Kryeministria – Memorandumi/projekti Durrës Yachts & Marina (faqja zyrtare)",
          "url": "https://www.kryeministria.al/en/newsroom/nenshkruhet-memorandumi-i-bashkepunimit-midis-eagle-hills-real-estate-development-shpk-dhe-albanian-seaports-development-company-per-realizimin-e-projektit-durres-yachts-m/"
        },
        {
          "kind": "mediatik",
          "label": "Monitor.al – Durrës Marina arkëtoi 22 milionë euro në 2023 nga shitja e apartamenteve \"në ajër\"",
          "url": "https://monitor.al/durres-marina-arketoi-22-milione-euro-ne-2023-n-nga-shitja-e-apartamenteve-ne-ajer/"
        },
        {
          "kind": "mediatik",
          "label": "Monitor.al – \"Projekti strategjik\" mbledh 42 mln euro nga shitja e apartamenteve në ajër",
          "url": "https://monitor.al/en/durres-marina-projekti-strategjik-mbledh-42-mln-euro-nga-shitja-e-apartamenteve-ne-ajer/"
        },
        {
          "kind": "mediatik",
          "label": "OBCT / Balcani Caucaso – Port of Durrës: plans proceed amid opacity and benefits for the few",
          "url": "https://www.balcanicaucaso.org/en/cp_article/port-of-durres-plans-proceed-amid-opacity-and-benefits-for-the-few/"
        },
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN) – Probe Confirms Subsidence of Two Buildings at Durrës Marina (maj 2026)",
          "url": "https://www.reporter.al/en/2026/05/13/probe-confirms-subsidence-of-two-buildings-at-billion-euro-durres-marina-project/"
        }
      ],
      "note": "Shifra kryesore (~2 miliardë euro) është vlera e shpallur e investimit të projektit, jo para publike të paguara, jo gjetje auditimi e KLSH dhe jo dëm i konfirmuar nga gjykata; shifra ~22 milionë euro vjen nga bilanci i vetë shoqërisë (raportuar nga Monitor.al), ndërsa shqetësimet për vlerësimin e aseteve dhe hetimi për subsidencën janë në proces, pa vendim të formës së prerë."
    },
    {
      "id": "porto-romano-durres-port-tender",
      "sector": "Porte dhe infrastrukturë detare",
      "year": "2021–2026",
      "value": 393000000,
      "shortTitle": "Porto Romano — tenderi i portit të Durrësit",
      "title": "Porti i ri i integruar i Durrësit në Porto Romano — tenderi i ndërtimit nën hetim nga SPAK",
      "valueLabel": "Fondi limit i tenderit të ndërtimit (Faza I), rreth 39,3 miliardë lekë pa TVSH, nga buxheti i shtetit",
      "blurb": "Tenderi rreth 393 milionë euro për ndërtimin e portit të ri tregtar në Porto Romano — që do të zhvendoste ngarkesat e portit aktual të Durrësit dhe do të çlironte vijën bregdetare për marinën e Eagle Hills — përfundoi në dështim e nën hetim penal. SPAK sekuestroi dosjen e tenderit; kompani të mëdha ndërkombëtare u skualifikuan dhe Van Oord depozitoi kallëzim penal; tenderi u anulua në mars 2026 pasi i vetmi konkurrent i mbetur, Archirodon, nuk paraqiti ofertën financiare.",
      "summary": "Qeveria shqiptare planifikoi ndërtimin e një porti të ri tregtar të integruar në Porto Romano (Durrës), Faza I e të cilit u vlerësua me fond limit rreth 39,3 miliardë lekë (≈393 milionë euro pa TVSH), i financuar nga buxheti i shtetit. Projekti lidhet me marrëveshjen rreth 2 miliardë euro me “Eagle Hills” (Mohamed Alabbar) të janarit 2023: porti i ri do të zhvendoste aktivitetin e ngarkesave nga porti ekzistues i Durrësit, duke liruar zonën për projektin “Durrës Yachts & Marina”.\n\nProjektimi i detajuar dhe strategjia u kryen nga holandezët “Royal HaskoningDHV” së bashku me “ABKONS” e të tjerë; kontrata e projektimit u nënshkrua më 24 dhjetor 2021 me vlerë rreth 11,4 milionë euro me TVSH dhe u rrit më pas me rreth 3 milionë euro. Më 26 qershor 2024, me vendim të Këshillit të Ministrave, Autoriteti Portual Durrës u autorizua të negocionte “në tavolinë” (pa tender) një kontratë konsulence/mbikëqyrjeje rreth 12 milionë euro me Royal Haskoning, gjë e cilësuar nga media si precedent negativ për transparencën e prokurimit publik. Sipas raportimeve mediatike, totali i paguar/angazhuar për kompaninë holandeze arrin rreth 24 milionë euro.\n\nTenderi i ndërtimit u shpall fillimisht në korrik 2024 (u anulua) dhe u rihap më 24 dhjetor 2024, me pesë operatorë ndërkombëtarë. Në fazën e parakualifikimit (prill 2025) u skualifikuan kompani të mëdha si China Communications Construction Company (CCCC), Webuild dhe Jan De Nul (në disa burime përmendet edhe grupi Vinci). Më pas, në fazën përfundimtare, u skualifikua edhe konsorciumi i Van Oord (me Besix), i cili depozitoi kallëzim penal për shpërdorim detyre dhe trajtim të pabarabartë. Që nga dhjetori 2025 procedura është nën hetim nga SPAK, dhe hetuesit e Byrosë Kombëtare të Hetimit sekuestruan dosjen e tenderit.\n\nKonkurrenti i vetëm i mbetur, “Archirodon” (me DEME dhe Società Italiana Dragaggi), u shpall fitues automatik rreth fundit të janarit 2026, por nuk paraqiti ofertën financiare brenda afatit 9 mars 2026. Më 11 mars 2026 tenderi u anulua zyrtarisht; ministri i Infrastrukturës e shpjegoi tërheqjen me arsye ekonomike (rritje kostosh), ndërsa presioni i Dhomës Amerikane të Tregtisë (Grant Van Cleeve) kundër projektit u raportua gjerësisht. Asnjë kontratë ndërtimi nuk u nënshkrua dhe çështja vijon e hapur (hetim i SPAK, mosfajësia e presupozuar). Veçmas, KLSH kishte audituar Autoritetin Portual Durrës për periudhën 2018–2020 me gjetje totale 2.575.066.085 lekë, por ai auditim nuk mbulon tenderin e Porto Romanos.",
      "status": [
        "kontrate",
        "spak",
        "proces",
        "klsh",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Fondi limit i tenderit të ndërtimit (Faza I)",
          "value": "≈39,3 miliardë lekë / rreth 393 milionë euro pa TVSH, nga buxheti i shtetit (shpesh cituar edhe ~399–400 mln €). Tender i shpallur më 24 dhjetor 2024; i anuluar më 11 mars 2026.",
          "statusKey": "kontrate",
          "source": "Balkanweb (EN) / OBCT"
        },
        {
          "label": "Hetimi i SPAK dhe sekuestrimi i dosjes",
          "value": "Procedura nën hetim nga SPAK që prej dhjetorit 2025; BKH sekuestroi dosjen e tenderit (shkurt 2026). Van Oord depozitoi kallëzim penal për shpërdorim detyre dhe trajtim të pabarabartë. Pa vendim përfundimtar — mosfajësia e presupozuar.",
          "statusKey": "spak",
          "source": "Balkanweb (EN) / Balkan Insight (BIRN)"
        },
        {
          "label": "Kontratat e Royal HaskoningDHV (projektim + mbikëqyrje)",
          "value": "Projektim ≈11,4 mln € me TVSH (nënshkruar 24.12.2021), shtuar ~3 mln € → ~13,6 mln €; plus ~12 mln € konsulencë/mbikëqyrje me negociim pa tender (VKM 26.06.2024). Total i raportuar ~24 mln €.",
          "statusKey": "mediatik",
          "source": "Balkanweb (EN) / BoldNews"
        },
        {
          "label": "Auditimi i KLSH te Autoriteti Portual Durrës",
          "value": "Gjetje totale 2.575.066.085 lekë për ekonomicitet/efiçencë/efektivitet, periudha 01.07.2018–31.12.2020 (raport tetor 2021). Nuk lidhet specifikisht me tenderin e Porto Romanos.",
          "statusKey": "klsh",
          "source": "KLSH, raport përfundimtar auditimi"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Balkanweb (EN): SPAK sekuestron dosjen e tenderit 400 mln € të Porto Romanos",
          "url": "https://www.balkanweb.com/en/vetem-nje-kompani-ne-gare-spak-sekuestron-dosjen-e-tenderit-me-vlere-400-mln-euro-te-porto-romanos/"
        },
        {
          "kind": "mediatik",
          "label": "Balkanweb (EN): Tenderi 400 mln € anulohet pas presionit amerikan; ministri flet për arsye ekonomike",
          "url": "https://www.balkanweb.com/en/tenderi-400-mln-euro-per-portin-e-ri-ne-porto-romano-u-anulua-pas-presionit-amerikan-ministri-i-infrastruktures-kemi-terheqje-per-arsye-ekonomike/"
        },
        {
          "kind": "mediatik",
          "label": "Balkanweb (EN): kompanitë që fituan projektimin e portit (11,4→13,6 mln € + ~12 mln € mbikëqyrje pa tender, VKM 26.06.2024)",
          "url": "https://www.balkanweb.com/en/filiali-i-kompanise-holandeze-ne-shqiperi-probleme-me-pagimin-e-taksave-ne-shenjester-zbulon-kush-jane-kompanite-qe-fituan-tenderin-per-projektimin-e-portit-te-durresit-ne-porto-ro/"
        },
        {
          "kind": "mediatik",
          "label": "Balkan Insight (BIRN): Acrimony and Accusations Hold up Construction of Albanian Port",
          "url": "https://balkaninsight.com/2026/05/25/acrimony-and-accusations-hold-up-construction-of-albanian-port/bi/"
        },
        {
          "kind": "klsh",
          "label": "KLSH: Raport përfundimtar auditimi, Autoriteti Portual Durrës (periudha 2018–2020)",
          "url": "https://www.klsh.org.al/wp-content/uploads/2025/02/Raport-perfundimtar-i-auditimit-te-ushtruar-ne-Autoritetin-Portual-Durres.pdf"
        }
      ],
      "note": "Shifra kryesore (≈393 mln €) është fondi limit i tenderit (tavani i prokurimit), jo para të paguara apo dëm i provuar; tenderi u anulua pa kontratë ndërtimi të nënshkruar. Hetimi i SPAK është në proces — vlen mosfajësia e presupozuar."
    },
    {
      "id": "vlora-airport-concession",
      "sector": "Aeroporte / Koncesione PPP (BOT)",
      "year": "2019–2026",
      "value": 104300000,
      "shortTitle": "Aeroporti i Vlorës",
      "title": "Koncesioni i Aeroportit Ndërkombëtar të Vlorës (Mabco/Mabetex – YDA – 2A Group)",
      "valueLabel": "Vlera e investimit të koncesionit (ndërtim + operim 35-vjeçar)",
      "blurb": "Koncesion ~104.3 milionë euro për ndërtimin dhe operimin 35-vjeçar të aeroportit, brenda zonës së mbrojtur Vjosë-Nartë; SPAK heton paracaktim të fituesit dhe ka marrë të pandehurit e parë.",
      "summary": "Koncesioni i Aeroportit Ndërkombëtar të Vlorës u shpall në dhjetor 2019 dhe kontrata 35-vjeçare u nënshkrua në prill 2021 nga ministrja e atëhershme e Infrastrukturës dhe Energjisë, Belinda Balluku, me një vlerë investimi prej rreth 104.3 milionë eurosh. Fitues u shpall bashkimi i kompanive Mabco Construction (e biznesmenit kosovar Behgjet Pacolli), grupit turk YDA dhe 2A Group të Valon Ademit; shoqëria koncesionare \"Vlora International Airport\" (VIA) u themelua më 17 maj 2021 me ndarjen Mabco 58% – YDA 40% – 2A Group 2%, ndarje që ndryshoi më pas pas tërheqjes së YDA-së. Punimet nisën më 28 nëntor 2021 dhe fluturimi i parë i certifikimit u krye më 8 maj 2025. Projekti ndodhet brenda peizazhit të mbrojtur Vjosë-Nartë; Komiteti i Përhershëm i Konventës së Bernës ka kërkuar disa herë (përfshirë 2024) ndalimin e punimeve derisa të kryhet një vlerësim i plotë i ndikimit në mjedis, dhe çështja u ngrit edhe me pyetje parlamentare në Parlamentin Europian (E-002918/2024). Në prill 2026 SPAK njoftoi akuzat e para, duke marrë të pandehur tre anëtarë të Komisionit të Vlerësimit të Ofertave për \"shkelje të barazisë në tendera\", me dyshime për paracaktim të fituesit; sipas raportimeve mediatike hetimi përfshin deri në 7 persona dhe vazhdon ndaj zyrtarëve të nivelit të lartë. Paralelisht, Mabco e Pacollit raportohet se mori një kredi 100 milionë euro nga fondi Delphos (mars 2025) duke vënë aeroportin si kolateral, çka shkaktoi alarm qeveritar dhe vendime gjykate për pezullimin e të drejtës së votës së Mabco-s në VIA. Asnjë vendim përfundimtar gjykate nuk ekziston deri më tani.",
      "status": [
        "kontrate",
        "spak",
        "proces",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Vlera e investimit të koncesionit (35-vjeçar)",
          "value": "~104.3 milionë euro për ndërtimin dhe operimin e aeroportit; OCCRP raporton edhe një garanci të ardhurash nga shteti deri në 138.2 milionë euro nëse synimet e fitimit nuk arrihen brenda vitit të 13-të",
          "statusKey": "kontrate",
          "source": "OCCRP; Albanian Daily News; Balkanweb"
        },
        {
          "label": "Hetimi i SPAK – akuzat e para (prill 2026)",
          "value": "SPAK mori të pandehur tre anëtarë të Komisionit të Vlerësimit të Ofertave për 'shkelje të barazisë në tendera', me dyshime për paracaktim të fituesit (dhjetor 2019–mars 2021); hetimi vijon dhe sipas mediave përfshin deri në 7 persona e zyrtarë të lartë. Pa vendim përfundimtar – vlen prezumimi i pafajësisë",
          "statusKey": "spak",
          "source": "Shqiptarja.com; Balkanweb (Klodiana Lala); Panorama"
        },
        {
          "label": "Ndikimi mjedisor – zona e mbrojtur Vjosë-Nartë",
          "value": "Komiteti i Përhershëm i Konventës së Bernës ka kërkuar disa herë (përfshirë 2024) ndalimin e punimeve derisa të kryhet një VNM e plotë; çështja u ngrit edhe me pyetje parlamentare në PE (E-002918/2024); KE-ja deklaroi se projekti bie ndesh me ligjet kombëtare dhe konventat ndërkombëtare",
          "statusKey": "zyrtar",
          "source": "EuroNatur (Bern Convention); Parlamenti Europian E-002918/2024"
        },
        {
          "label": "Kredia 100 mln € e Delphos dhe hipoteka mbi aeroportin",
          "value": "Mabco e Pacollit raportohet se mori kredi 100 milionë euro nga Delphos Securities SARL (Compartment Bernina), mars 2025, duke vënë aeroportin si kolateral; gjykatat pezulluan të drejtën e votës së Mabco-s në VIA. Detaje të raportuara nga media, ende të paverifikuara nga gjykimi përfundimtar",
          "statusKey": "mediatik",
          "source": "Ora Info; VoxNews; Kapitali"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "OCCRP – Investigim: cronyism dhe shqetësime mjedisore për aeroportin e Vlorës",
          "url": "https://www.occrp.org/en/investigation/new-albanian-airport-raises-cronyism-environment-concerns"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com – SPAK merr të pandehur 3 anëtarët e KVO-së për shkelje të barazisë",
          "url": "https://shqiptarja.com/lajm/aeroporti-i-vlores-spak-nis-me-akuzat-zyrtare-merr-te-pandehur-3-anetaret-e-kvo-per-shkelje-te-barazise-ne-tendera-vijojne-hetimet"
        },
        {
          "kind": "mediatik",
          "label": "Balkanweb – Si u favorizuan Mabco, YDA Group dhe 2A Group (analizë e dosjes SPAK)",
          "url": "https://www.balkanweb.com/en/Vlora-airport-tender-predetermined-SPAK-did-not-submit-balance-sheets-and-audit-reports--how-were-mabco-construction-yda-group-favored/"
        },
        {
          "kind": "zyrtar",
          "label": "Parlamenti Europian – Pyetje parlamentare E-002918/2024 për aeroportin e Vlorës",
          "url": "https://www.europarl.europa.eu/doceo/document/E-10-2024-002918_EN.html"
        },
        {
          "kind": "mediatik",
          "label": "EuroNatur – Konventa e Bernës kërkon ndalimin e aeroportit të Vlorës",
          "url": "https://www.euronatur.org/en/what-we-do/news/bern-convention-urges-to-stop-vlora-airport-in-albania"
        }
      ],
      "note": "Shifra 104.3 mln € është vlera e investimit të koncesionit, jo para të vjedhura: SPAK heton shkelje procedurale (paracaktim fituesi) pa vendim përfundimtar, ndaj vlen prezumimi i pafajësisë; kredia 100 mln € e Delphos është detyrim privat bankar, jo dëm publik i provuar."
    },
    {
      "id": "milot-balldren-road-ppp",
      "sector": "Infrastrukturë rrugore",
      "year": "2018–2024",
      "value": 256000000,
      "shortTitle": "Koncesioni Milot–Balldren (A.N.K)",
      "title": "Koncesioni i autostradës Milot–Balldren (A.N.K shpk)",
      "valueLabel": "Vlera e kontratës koncesionare të miratuar me ligjin special 52/2019 (me TVSH)",
      "blurb": "Një koncesion PPP për 17.2 km rrugë Milot–Balldren, i nisur nga një propozim i pakërkuar i kompanisë A.N.K (Agim Kolla) dhe i miratuar me ligjin special 52/2019. KLSH gjeti të dhëna të falsifikuara e kontradiktore në studimin e fizibilitetit dhe rritje kostosh të pajustifikuara; kontrata u njoftua për zgjidhje në dhjetor 2021 dhe padia e koncesionarit u rrëzua deri në Gjykatën Kushtetuese (tetor 2024).",
      "summary": "Projekti për ndërtimin e segmentit rrugor Milot–Balldren (17.2 km) nisi nga një propozim i pakërkuar i kompanisë shqiptare A.N.K shpk (në pronësi të Agim Kollës) dhe, pas garës konkurruese të tetorit 2018, u dha si koncesion/PPP me vlerë fillestare 161.5 milionë euro për ndërtim e mirëmbajtje. Pas rinegocimit pa garë, vlera e kontratës u rrit në 213.6 milionë euro pa TVSH, ose rreth 256 milionë euro me TVSH, e miratuar me ligjin special 52/2019.\n\nNë auditimin e vitit 2019, Kontrolli i Lartë i Shtetit (KLSH) gjeti se të dhënat që shoqëronin kontratën ishin të falsifikuara: tabela me të njëjtin numër protokolli paraqitnin shifra e afate financimi të ndryshme. KLSH konstatoi gjithashtu se rikategorizimi i rrugës e rriti koston e ndërtimit nga rreth 61.5 në rreth 140 milionë euro pa justifikim teknik për trafikun e parashikuar, se kostot e shpronësimit nuk ishin përfshirë, dhe se vlera reale e investuar ishte rreth 16 milionë euro e jo 30 milionë euro. U vu në dyshim edhe kapaciteti financiar i A.N.K, që në 2017 kishte aktive totale vetëm 16 milionë euro dhe kapital 3.2 milionë euro, ndërsa premtonte 52 milionë euro vetëfinancim.\n\nMë 16 dhjetor 2021, Ministria e Infrastrukturës i dërgoi A.N.K dhe shoqërisë \"Bardh Konstruksion\" njoftimin për zgjidhjen e kontratës për mospërmbushje të kushteve paraprake dhe mbylljes financiare. Padia e koncesionarit u rrëzua në të tri shkallët e gjyqësorit, me vendimin përfundimtar të Gjykatës Kushtetuese në tetor 2024. Pronari i A.N.K raportohet të jetë nën vëmendjen e SPAK në çështje të tjera.",
      "status": [
        "klsh",
        "kontrate",
        "gjykate",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera e kontratës koncesionare (ligji special 52/2019)",
          "value": "213.6 milionë euro pa TVSH / ~256 milionë euro me TVSH për 17.2 km; vlera fillestare e garës 161.5 milionë euro",
          "statusKey": "kontrate",
          "source": "Open Procurement Albania; Revista Monitor"
        },
        {
          "label": "Studim fizibiliteti me të dhëna të falsifikuara dhe kontradiktore",
          "value": "KLSH gjeti tabela me të njëjtin numër protokolli por me shifra/afate financimi të ndryshme; kosto ndërtimi e rritur nga ~61.5 në ~140 milionë euro pa justifikim teknik; kostot e shpronësimit të papërfshira; investim real ~16 mln euro jo 30 mln euro",
          "statusKey": "klsh",
          "source": "Raporti i auditimit të KLSH (2019), Lapsi.al, Argumentum.al, Hashtag.al"
        },
        {
          "label": "Njoftim për zgjidhjen e kontratës",
          "value": "16 dhjetor 2021 — Ministria e Infrastrukturës njofton A.N.K dhe 'Bardh Konstruksion' për mospërmbushje të kushteve paraprake dhe mbylljes financiare",
          "statusKey": "kontrate",
          "source": "Revista Monitor; VoxNews"
        },
        {
          "label": "Vendimi gjyqësor përfundimtar",
          "value": "Padia e koncesionarit A.N.K u rrëzua në Gjykatën Administrative, Gjykatën e Lartë dhe Gjykatën Kushtetuese; vendim përfundimtar tetor 2024",
          "statusKey": "gjykate",
          "source": "Balkanweb; Revista Monitor"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "Open Procurement Albania — regjistri i koncesionit Milot–Balldren (A.N.K, NIPT J92408001N, ligji 52/2019)",
          "url": "https://openprocurement.al/sq/concession/view/id/17"
        },
        {
          "kind": "klsh",
          "label": "KLSH — Kontrolli i Lartë i Shtetit (faqja zyrtare e dokumenteve të auditimit)",
          "url": "https://www.klsh.org.al/index.php/file_content/3138"
        },
        {
          "kind": "mediatik",
          "label": "Lapsi.al — Raporti i KLSH: Koncesioni Milot–Balldren me shkelje, si u rritën kostot",
          "url": "https://lapsi.al/2019/10/22/raporti-i-klsh-koncesioni-i-rruges-milot-balldren-me-shkelje-si-u-rriten-kostot/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Koncesioni fantazmë i Milot–Balldren aktiv, qeveria kërkon zgjidhje të njëanshme",
          "url": "https://monitor.al/koncesioni-fantazme-i-milot-balldren-aktiv-qeveria-kerkon-zgjidhje-te-njeanshme/"
        },
        {
          "kind": "mediatik",
          "label": "Argumentum.al — Rruga Milot–Balldren, KLSH: Falsifikime dhe zero investime",
          "url": "https://www.argumentum.al/rruga-milot-balldren-klsh-falsifikime-dhe-zero-investime/"
        }
      ],
      "note": "Shifra 256 mln euro është vlera e kontratës koncesionare të miratuar me ligj (me TVSH), jo para publike efektivisht të paguara: kontrata u zgjidh para mbylljes financiare dhe pothuajse pa punime; gjetjet e KLSH-së janë konstatime auditimi, jo një vendim gjyqësor i formës së prerë për dëm."
    },
    {
      "id": "copri-aktor-tirana-elbasan-icc",
      "sector": "Infrastrukturë rrugore / ndërtim",
      "year": "2012–2022",
      "value": 42915256,
      "shortTitle": "Copri & Aktor kundër ARRSH (autostrada Tiranë–Elbasan)",
      "title": "JV Copri & Aktor kundër Autoritetit Rrugor Shqiptar (ARRSH) — Arbitrazhi ICC për autostradën Tiranë–Elbasan",
      "valueLabel": "Detyrim i shtetit sipas vendimit përfundimtar të arbitrazhit ICC (~45.37 mln USD / ~42.9 mln EUR)",
      "blurb": "Autoriteti Rrugor Shqiptar (ARRSH) u detyrua nga arbitrazhi tregtar ndërkombëtar i ICC të paguajë rreth 45.37 milionë dollarë (~42.9 milionë euro) ndaj bashkimit të kompanive Copri Construction (Kuvajt) dhe Aktor (Greqi) për kosto shtesë e ndryshime gjatë ndërtimit të dy segmenteve të autostradës Tiranë–Elbasan. Vendimi përfundimtar i ICC u dha më 1 shtator 2020 dhe kërkesa e palës shqiptare për anulim u rrëzua nga Gjykata e Apelit të Parisit më 31 maj 2022, duke e bërë detyrimin përfundimtar.",
      "summary": "Më 10 dhe 13 shkurt 2012, Drejtoria e Përgjithshme e Rrugëve / ARRSH nënshkroi me bashkimin e kompanive JV Copri Construction Enterprises W.L.L. (Kuvajt) dhe Aktor (Greqi) dy kontrata për ndërtimin e Segmentit nr. 1 dhe Segmentit nr. 3 të autostradës Tiranë–Elbasan, projekt i parafinancuar pjesërisht nga Banka Islamike për Zhvillim dhe me kosto fillestare të raportuar rreth 293 milionë dollarë. Gjatë zbatimit kontrata u ndryshua disa herë (mediat raportojnë deri në 12 ndryshime) dhe kostot u rritën ndjeshëm; kompanitë ngritën pretendime për kosto shtesë (maj–dhjetor 2015) që kaluan përmes një Bordi për Zgjidhjen e Mosmarrëveshjeve.\n\nPas dështimit të zgjidhjes me mirëkuptim, çështja shkoi në arbitrazh tregtar pranë Gjykatës Ndërkombëtare të Arbitrazhit (ICC), çështjet nr. 23998/MHM-HBH dhe 24011/MHM-HBH, me seli në Paris. Tribunali (Willem van Baren kryetar, Eduardo Silva Romero dhe Peter Rees QC bashkë-arbitër) dha vendimin përfundimtar më 1 shtator 2020 në favor të kompanive, duke detyruar ARRSH-në të paguajë rreth 45.37 milionë dollarë (~42.9 milionë euro), plus tarifa administrative e shpenzime ligjore. ARRSH kërkoi anulimin e vendimit pranë Gjykatës së Apelit të Parisit (çështja 20/17978), por kërkesa u rrëzua më 31 maj 2022 dhe vendimi i arbitrazhit mbeti në fuqi.\n\nParalelisht, projekti ka qenë objekt hetimi në Shqipëri. Në shkurt 2018 ish-drejtori i ARRSH-së Dashamir Gjika (Xhika) dhe dy vartës (Albens Alite, Aksel Qorduka) u arrestuan për akuza abuzimi me detyrën lidhur me kostot e fryra; ata u shpallën të pafajshëm në korrik 2021, dhe çështja u referua për hetim të mëtejshëm. Sipas mediave, një auditim i Ministrisë së Infrastrukturës e vlerësoi dëmin ekonomik deri në ~53 milionë euro / ~36 milionë dollarë, por këto janë shifra të raportuara nga auditimi/mediat dhe NUK ka vendim gjyqësor të formës së prerë që të vërtetojë vjedhje apo përvetësim.",
      "status": [
        "arbitrazh",
        "gjykate",
        "kontrate",
        "proces"
      ],
      "facts": [
        {
          "label": "Vendimi përfundimtar i arbitrazhit ICC (1 shtator 2020) — detyrim ndaj ARRSH",
          "value": "~45,367,986 USD (~42,915,256 EUR), plus tarifa administrative e shpenzime ligjore",
          "statusKey": "arbitrazh",
          "source": "Open Data Albania; italaw (ICC 23998/MHM & 24011/MHM)"
        },
        {
          "label": "Kërkesa e ARRSH për anulim — Gjykata e Apelit të Parisit (31 maj 2022, çështja 20/17978)",
          "value": "U rrëzua; vendimi i arbitrazhit mbeti në fuqi (detyrim i konfirmuar)",
          "statusKey": "gjykate",
          "source": "jusmundi — Arrêt de la Cour d'appel de Paris, 31.05.2022"
        },
        {
          "label": "Kostoja e projektit të autostradës Tiranë–Elbasan (Segmentet 1 & 3)",
          "value": "Kosto fillestare ~293 mln USD; e rritur ndjeshëm pas ~12 ndryshimeve kontraktore (raportim mediatik)",
          "statusKey": "kontrate",
          "source": "Shqiptarja.com; Revista Monitor"
        },
        {
          "label": "Dëmi ekonomik i pretenduar nga auditimi / hetimi penal në Shqipëri",
          "value": "~53 mln EUR (auditim i Ministrisë) / ~36 mln USD; tre ish-zyrtarë të ARRSH-së të arrestuar 2018, të pafajshëm korrik 2021 — pa vendim të formës së prerë",
          "statusKey": "proces",
          "source": "Euronews Albania; Shqiptarja.com (raportim mediatik)"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "italaw — Copri Constructions et al. v. Albanian Road Authority, ICC Cases 24011/MHM & 23998/MHM (vendimi i anulimit 31.05.2022)",
          "url": "https://www.italaw.com/cases/9444"
        },
        {
          "kind": "zyrtar",
          "label": "jusmundi — Final Award, 1 shtator 2020 (JV Copri/Aktor v. Albanian Road Authority)",
          "url": "https://jusmundi.com/en/document/decision/en-1-the-joint-venture-jv-copri-construction-enterprises-w-l-l-aktor-technical-societe-anonyme-2-copri-construction-enterprises-w-l-l-3-aktor-s-a-v-albanian-road-authority-under-the-authority-of-the-ministry-of-public-works-and-transport-final-award-tuesday-1st-september-2020"
        },
        {
          "kind": "zyrtar",
          "label": "jusmundi — Arrêt de la Cour d'appel de Paris (Pôle 5 - Ch. 16), 20/17978, 31 maj 2022 (anulimi i rrëzuar)",
          "url": "https://jusmundi.com/en/document/decision/fr-1-the-joint-venture-jv-copri-construction-enterprises-w-l-l-aktor-technical-societe-anonyme-2-copri-construction-enterprises-w-l-l-3-aktor-s-a-v-albanian-road-authority-under-the-authority-of-the-ministry-of-public-works-and-transport-arret-de-la-cour-dappel-de-paris-tuesday-31st-may-2022"
        },
        {
          "kind": "zyrtar",
          "label": "Open Data Albania — Cases Lost in Arbitration: Liabilities of the Albanian State (maj 2022)",
          "url": "https://ndiqparate.al/?p=19599&lang=en"
        },
        {
          "kind": "mediatik",
          "label": "Euronews Albania — Tirana–Elbasan highway scandal: SPAK probe into public officials",
          "url": "https://euronews.al/en/tirana-elbasan-highway-scandal-spak-probes-into-high-public-officials/"
        }
      ],
      "note": "Shifra kryesore (~45.37 mln USD / ~42.9 mln EUR) është detyrim i konfirmuar nga arbitrazhi tregtar ICC dhe nga Apeli i Parisit, jo dëm i provuar nga korrupsioni; akuzat penale ndaj ish-zyrtarëve përfunduan me pafajësi në shkallë të parë (korrik 2021) dhe nuk ka vendim të formës së prerë."
    },
    {
      "id": "national-theatre-demolition-fusha",
      "sector": "Ndërtesa publike / Kulturë e trashëgimi",
      "year": "2018–2026",
      "value": 40000000,
      "shortTitle": "Teatri Kombëtar — Ligji 37/2018 / Fusha shpk",
      "title": "Shembja dhe rindërtimi i Teatrit Kombëtar (Ligji 37/2018 / Fusha shpk)",
      "valueLabel": "Kosto e raportuar e ndërtimit të teatrit të ri me fonde publike (rreth 40 milionë euro)",
      "blurb": "Një ligj i posaçëm (Ligji 37/2018) i hapi rrugë qeverisë të negocionte jashtë prokurimit të zakonshëm me kompaninë private Fusha shpk, e cila në shkëmbim të ndërtimit të teatrit do të merrte tokë publike në qendër të Tiranës për kulla. Teatri historik — i përfshirë nga Europa Nostra në listën e \"7 monumenteve më të rrezikuara në Evropë 2020\" — u shemb në agim më 17 maj 2020 gjatë kufizimeve të COVID-19 dhe mes protestave. Gjykata Kushtetuese e shfuqizoi ligjin më 2 korrik 2021. Sot teatri i ri po ndërtohet me fonde publike, ndërsa në maj 2023 Bashkia i kaloi Fusha shpk një truall publik 1.266 m².",
      "summary": "Më 16 shkurt 2018 kompania Fusha shpk i paraqiti Bashkisë së Tiranës një propozim të pakërkuar (unsolicited): të ndërtonte falas një teatër të ri kombëtar në shkëmbim të lejes për të ngritur kulla komerciale në tokë publike. Për të lejuar këtë marrëveshje jashtë rregullave të zakonshme të prokurimit publik, Kuvendi miratoi Ligjin e posaçëm nr. 37/2018 (20 shtator 2018), i njohur popullarisht si \"Ligji i Fushës\". Më parë, në prill 2017 ndërtesa ishte hequr nga zona e mbrojtur e trashëgimisë kulturore. Teatri Kombëtar i ndërtuar në 1938–39, shembull i arkitekturës racionaliste italiane, u përfshi më 24 mars 2020 nga Europa Nostra dhe Instituti i Bankës Evropiane të Investimeve në listën e \"7 monumenteve më të rrezikuara në Evropë 2020\". Pavarësisht protestave shumëvjeçare dhe një ankese kushtetuese të depozituar nga Presidenti Ilir Meta (korrik 2019), godina u shemb në agimin e 17 majit 2020, gjatë kufizimeve të pandemisë COVID-19, pasi forcat policore evakuuan me forcë aktivistët. Marrëveshja origjinale me Fushën dështoi në shkurt 2020. Më 2 korrik 2021 Gjykata Kushtetuese (vendim nr. 29) shfuqizoi Ligjin 37/2018 dhe VKM nr. 377/2020 për kalimin e pronës te Bashkia, duke i cilësuar antikushtetuese; ajo nuk u shpreh për kushtetutshmërinë e vetë shembjes. Sot teatri i ri (projekt i Bjarke Ingels Group) po ndërtohet me fonde publike me kosto të raportuar rreth 40 milionë euro. Më 5 maj 2023 Këshilli Bashkiak i Tiranës i kaloi Fusha shpk një truall publik 1.266 m² pas teatrit, ku më vonë doli se kompania synonte një kullë 23-katëshe — duke ringjallur shqetësimet për dhënien e pasurisë publike pa garë.",
      "status": [
        "gjykate",
        "klsh",
        "mediatik",
        "proces"
      ],
      "facts": [
        {
          "label": "Ligji i posaçëm nr. 37/2018 (\"Ligji i Fushës\") i shfuqizuar nga Gjykata Kushtetuese",
          "value": "Gjykata Kushtetuese, me vendimin nr. 29 datë 2 korrik 2021, shfuqizoi Ligjin 37/2018 dhe VKM nr. 377/2020 për kalimin e pronës te Bashkia e Tiranës si antikushtetuese; nuk u shpreh për kushtetutshmërinë e vetë shembjes.",
          "statusKey": "gjykate",
          "source": "Agjencia Telegrafike Shqiptare (ATSH), 2 korrik 2021"
        },
        {
          "label": "Shembja e godinës historike",
          "value": "Teatri Kombëtar (ndërtuar 1938–39) u shemb në agim më 17 maj 2020, gjatë kufizimeve të COVID-19, pasi policia evakuoi me forcë aktivistët. Më parë, prill 2017, ndërtesa ishte hequr nga zona e mbrojtur e trashëgimisë.",
          "statusKey": "mediatik",
          "source": "Transparency International – projekti i ligjeve të posaçme; Wikipedia"
        },
        {
          "label": "Vlera e kontratës origjinale me Fusha shpk — e paverifikueshme",
          "value": "Marrëveshja origjinale PPP me Fusha shpk dështoi në shkurt 2020 pa u finalizuar; nuk ekziston një vlerë kontrate e verifikuar. Si referencë, Fusha shpk kishte marrë rreth 36 milionë euro kontrata publike në 2015–2018, kryesisht nga Bashkia e Tiranës.",
          "statusKey": "kontrate",
          "source": "Transparency International – \"Law for building a new national theatre\""
        },
        {
          "label": "Kalimi i truallit publik 1.266 m² te Fusha shpk (2023)",
          "value": "Më 5 maj 2023 Këshilli Bashkiak i Tiranës i kaloi Fusha shpk një truall publik 1.266 m² pas teatrit, me ndarje 50% të sipërfaqes së ndërtimit; në mars 2024 doli se kompania synonte një kullë 23-katëshe. Teatri i ri po ndërtohet me fonde publike, me kosto të raportuar ~40 milionë euro.",
          "statusKey": "mediatik",
          "source": "Wikipedia – National Theatre (Albania); citizens.al"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Transparency International – \"Law for building a new national theatre\" (projekti i ligjeve të posaçme / tailor-made laws)",
          "url": "https://www.transparency.org/en/projects/laws-project/data/law-for-building-a-new-national-theatre"
        },
        {
          "kind": "zyrtar",
          "label": "Europa Nostra – \"7 monumentet më të rrezikuara në Evropë 2020\" (njoftimi zyrtar, 24 mars 2020)",
          "url": "https://www.europanostra.org/europe-7-most-endangered-heritage-sites-2020-announced/"
        },
        {
          "kind": "zyrtar",
          "label": "Agjencia Telegrafike Shqiptare (ATSH) – Gjykata Kushtetuese publikon vendimin për Teatrin Kombëtar (2 korrik 2021)",
          "url": "https://ata.gov.al/2021/07/02/gjykata-kushtetuese-publikon-vendimin-per-teatrin-kombetar/"
        },
        {
          "kind": "mediatik",
          "label": "Wikipedia – National Theatre (Albania): shembja, kalimi i truallit 1.266 m² te Fusha (5 maj 2023), kulla 23-katëshe",
          "url": "https://en.wikipedia.org/wiki/National_Theatre_(Albania)"
        },
        {
          "kind": "mediatik",
          "label": "Albanian Institute of Science (AIS / Open Data Albania) – Overview of the efforts to demolish National Theatre building",
          "url": "https://ais.al/new/en/overview-of-the-efforts-to-demolish-national-theatre-building/"
        }
      ],
      "note": "Shifra kryesore (~40 milionë euro) është kosto e raportuar e ndërtimit aktual të teatrit të ri me fonde publike dhe NUK është vlerë e marrëveshjes origjinale me Fusha shpk, e cila dështoi pa u finalizuar; prandaj asnjë vlerë kontrate koncesioni nuk është e verifikueshme për Ligjin 37/2018."
    },
    {
      "id": "rruga-e-kombit-toll-concession",
      "sector": "Infrastrukturë rrugore / koncesion PPP (operim-mirëmbajtje me tarifë)",
      "year": "2016–2046 (kontrata 30-vjeçare; tarifimi nisi në 2018)",
      "value": 66000000,
      "shortTitle": "Tarifa e Rrugës së Kombit (A1)",
      "title": "Koncesioni i tarifës së Rrugës së Kombit (A1) — Albanian Highway Concession shpk",
      "valueLabel": "Subvencion i parashikuar nga buxheti i shtetit për koncesionarin gjatë 13 viteve të para (~9.4 miliardë lekë)",
      "blurb": "Koncesion 30-vjeçar për operimin dhe mirëmbajtjen e autostradës A1 (Milot–Morinë), me tarifë kalimi prej 5 euro për makinë — një nga më të lartat në Europë në raport me gjatësinë. Përveç tarifave që paguajnë qytetarët, buxheti i shtetit është angazhuar të paguajë rreth 66 milionë euro për koncesionarin në 13 vitet e para. Mbetet kryesisht një çështje transparence dhe vlere-për-para; nuk ka vendim penal të formës së prerë.",
      "summary": "Më 6 dhjetor 2016, Ministria e Transportit dhe Infrastrukturës nënshkroi Kontratën Koncesionare nr. 2584 me shoqërinë \"Albanian Highway Concession\" shpk për përmirësimin, operimin dhe mirëmbajtjen e autostradës A1 \"Rruga e Kombit\" (Milot–Morinë, ~114–128 km) për një periudhë 30-vjeçare. Sipas të dhënave zyrtare të ATRAKO-s, vlera e investimit privat të koncesionit është rreth 100 milionë euro për 30 vjet (~45 mln euro në 4 vitet e para dhe ~54 mln euro në vitet 5–30). Koncesionari sot zotërohet 50% nga Kastrati Group dhe 50% nga Salillari, pasi ortaku fillestar Catalyst u tërhoq duke shitur kuotat për rreth 200 mijë euro.\\n\\nTarifimi nisi në mars 2018 me një tarifë prej 5 euro për makinë (2.5 euro për motoçikletë, deri në 22.5 euro për kamionë), e mbledhur pranë tunelit të Kalimashit. Vendosja e tarifës provokoi protesta të dhunshme në Kukës më 30–31 mars 2018, ku u dogjën kabinat/trau i pagesës dhe u plagosën policë; tarifimi u pezullua dhe u rinis në shtator 2018 pas rinovimeve dhe konsultimeve.\\n\\nKjo është kryesisht një çështje vlere-për-para dhe transparence. Krahas tarifave, buxheti i shtetit u angazhua të paguajë rreth 66 milionë euro (~9.4 miliardë lekë) për koncesionarin në 13 vitet e para — kryesisht kompensim për \"defektet e fshehura\" të rrugës dhe për mungesë trafiku ndaj një minimumi të garantuar të ardhurash. Sipas Revista Monitor (që citon Ministrinë e Financave), në periudhën 2018–2021 shteti pagoi rreth 20 milionë euro, ndërsa arkëtimet nga tarifat arritën rreth 37.7 milionë euro, mbi planin e koncesionarit. Tarifa prej 5 euro vlerësohet nga media (exit.al, të dhëna tolls.eu) si një nga më të lartat në Europë në raport me gjatësinë, ndërsa norma maksimale për mirëmbajtje në Europë citohet rreth 2.5 euro/100 km. Nuk ka vendim gjykate të formës së prerë dhe ky koncesion nuk figuron ndër ato nën hetim formal nga SPAK.",
      "status": [
        "kontrate",
        "zyrtar",
        "mediatik",
        "proces"
      ],
      "facts": [
        {
          "label": "Vlera e investimit të koncesionit (privat, 30 vjet)",
          "value": "~100 milionë euro (rreth 45 mln euro në 4 vitet e para + ~54 mln euro në vitet 5–30), për përmirësim, operim e mirëmbajtje",
          "statusKey": "zyrtar",
          "source": "ATRAKO (Agjencia e Trajtimit të Koncesioneve), atrako.gov.al"
        },
        {
          "label": "Subvencion i shtetit për koncesionarin (13 vitet e para)",
          "value": "~66 milionë euro (~9.4 miliardë lekë), kryesisht për 'defekte të fshehura' të rrugës dhe kompensim mungese trafiku",
          "statusKey": "zyrtar",
          "source": "Revista Monitor, duke cituar Ministrinë e Financave"
        },
        {
          "label": "Para publike të paguara faktikisht (2018–2021)",
          "value": "~20 milionë euro nga buxheti i shtetit; ndërkohë arkëtimet nga tarifat ~37.7 milionë euro (mbi planin e koncesionarit)",
          "statusKey": "zyrtar",
          "source": "Revista Monitor (tetor 2021), të dhëna nga Ministria e Financave"
        },
        {
          "label": "Tarifa dhe krahasimi europian",
          "value": "5 euro/makinë (deri 22.5 euro/kamion) për ~128 km; cilësuar nga media si një nga më të lartat në Europë në raport me gjatësinë (maksimumi tipik për mirëmbajtje ~2.5 euro/100 km)",
          "statusKey": "mediatik",
          "source": "exit.al (të dhëna tolls.eu); tolls.eu/albania"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "ATRAKO — Faqja zyrtare e koncesionit 'Rruga e Kombit' (vlera ~100 mln euro, kohëzgjatja 30 vjet, objekti)",
          "url": "http://atrako.gov.al/?p=1076"
        },
        {
          "kind": "zyrtar",
          "label": "OpenCorporates Albania — Albanian Highway Concession shpk (Kontrata nr. 2584, 06.12.2016; ortakët Kastrati 50% / Salillari 50%)",
          "url": "https://opencorporates.al/sq/nuis/l62427021g"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Subvencioni nga buxheti, defektet e kontratës dhe ~66 mln euro për 13 vjet",
          "url": "https://www.monitor.al/rriten-financimet-nga-buxheti-per-koncesionin-e-rruges-se-kombit-5-6-mln-euro-vetem-per-2019-shumica-per-defektet-e-kontrates/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — 37.7 mln euro arkëtime nga tarifat dhe 20 mln euro nga shteti (2018–2021)",
          "url": "https://www.monitor.al/37-7-mln-euro-taksa-te-paguara-per-rrugen-e-kombit-arketimet-me-te-larta-se-plani-i-koncesionarit-shteti-dha-20-mln-euro/"
        },
        {
          "kind": "mediatik",
          "label": "exit.al — Tarifa e Rrugës së Kombit, më e larta në Europë (krahasim me të dhëna tolls.eu)",
          "url": "https://exit.al/en/rruga-e-kombit-highway-toll-the-highest-in-europe/"
        }
      ],
      "note": "Kujdes: shifra \"mbi 1 miliard euro\" i referohet kostos historike të ndërtimit të rrugës (epoka Bechtel–ENKA, përpara koncesionit), JO vlerës së këtij koncesioni operim-mirëmbajtjeje (~100 mln euro investim privat + ~66 mln euro subvencion shtetëror). Si shifër kryesore u zgjodh angazhimi buxhetor publik (~66 mln euro/13 vjet), pasi është paraja publike më e drejtpërdrejtë dhe e dokumentuar zyrtarisht për këtë koncesion."
    },
    {
      "id": "skavica-hydropower-bechtel",
      "sector": "Energji / hidroenergji",
      "year": "2021–2026",
      "value": 1000000000,
      "shortTitle": "HEC Skavica (Bechtel)",
      "title": "HEC Skavica — ligji special për Bechtel në lumin Drin",
      "valueLabel": "Kosto e parashikuar e projektit (e rritur drejt mbi 1 miliard euro / ~1.5 miliardë USD)",
      "blurb": "Parlamenti shqiptar përcaktoi me ligj të veçantë (nr. 38/2021) kompaninë amerikane Bechtel për projektimin dhe ndërtimin e hidrocentralit 210 MW të Skavicës në lumin Drin, duke anashkaluar tenderin e hapur. Kostoja e parashikuar u rrit nga 308–510 milionë euro drejt mbi 1 miliard euro (rreth 1.5 miliardë USD), me 41 fshatra dhe mbi 2,500 shtëpi në Dibër të kërcënuara nga përmbytja dhe pa financim të siguruar. Gjykata Kushtetuese pranoi për shqyrtim ankesën kushtetuese më 21 shtator 2023.",
      "summary": "Me ligjin e veçantë nr. 38/2021, datë 23.03.2021, Kuvendi i Shqipërisë caktoi drejtpërdrejt kompaninë amerikane Bechtel International Inc. për projektimin dhe ndërtimin e hidrocentralit të Skavicës (210 MW) në lumin Drin, pa procedurë tenderi konkurrues. Më 5–6 korrik 2021, KESH dhe Bechtel nënshkruan kontratën e Fazës 1 (\"Kontratë Shërbimesh Teknike — Projekti Hidroenergjetik Skavica\"), që mbulonte studimet teknike, mjedisore e sociale dhe punët paraprake; sipas raportimeve KESH i pagoi Bechtel rreth 16 milionë euro për këtë fazë studimore.\\n\\nStudimet fillestare të fizibilitetit (2021) parashikonin dy alternativa: 120 MW me kosto ~308 milionë euro dhe 210 MW me kosto ~510 milionë euro. Më pas vlerësimet u rritën disa herë drejt mbi 1 miliard euro, dhe deri në fund të vitit 2025 kostoja e ndërtimit raportohej mbi 1.5 miliardë USD. Projekti do të përmbyste segmentin e fundit të lirë të Drinit të Zi: sipas Bankwatch dhe organizatave mjedisore, preken 41 fshatra dhe mbi 2,500 shtëpi në bashkinë e Dibrës, dhe në skenarin e plotë (digë 147 m, rezervuar ~2.32 miliardë m³) ndikohen rreth 20,000 banorë dhe ~2,636 shtëpi.\\n\\nKomiteti Shqiptar i Helsinkit dhe Shoqata \"Drini i Zi\", me mbështetjen e EuroNatur dhe CEE Bankwatch, paraqitën ankesë kushtetuese; Gjykata Kushtetuese e pranoi për shqyrtim më 21 shtator 2023, me pretendimin për shkelje të barazisë para ligjit dhe lirisë ekonomike në dhënien e kontratave publike. Gjykata përfundimisht i rrëzoi pretendimet kryesore, duke e gjykuar ligjin në përputhje me Kushtetutën, ndërsa theksoi të drejtën e publikut për informim. Financimi mbetet i pasiguruar (janë eksploruar DFC e SHBA-së, UK Export Finance, HSBC dhe statusi flagship i BE-së, por asnjë hua nuk është nënshkruar) dhe ndërtimi nuk ka nisur.",
      "status": [
        "kontrate",
        "proces",
        "gjykate",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Ligji i veçantë dhe kontrata e Fazës 1 KESH–Bechtel",
          "value": "Ligji nr. 38/2021 (23.03.2021) cakton Bechtel pa tender; kontrata e Fazës 1 nënshkruar 5–6 korrik 2021 (studime teknike/mjedisore/sociale, ~18 muaj)",
          "statusKey": "kontrate",
          "source": "Ministria e Infrastrukturës (infrastruktura.gov.al); Bechtel (njoftim zyrtar); KESH"
        },
        {
          "label": "Kostoja fillestare e fizibilitetit (2021)",
          "value": "Alternativa A: 120 MW ≈ 308 mln euro; Alternativa B: 210 MW ≈ 510 mln euro",
          "statusKey": "mediatik",
          "source": "Gazeta Tema, shkurt 2021 (bazuar te studimi i KESH)"
        },
        {
          "label": "Kostoja e parashikuar e rritur",
          "value": "U rrit ~4 herë drejt mbi 1 miliard euro; deri në fund 2025 kostoja e ndërtimit raportohet mbi 1.5 miliardë USD; financim i pasiguruar",
          "statusKey": "mediatik",
          "source": "CEE Bankwatch (faqja e projektit dhe blog nëntor 2025)"
        },
        {
          "label": "Ankesa kushtetuese dhe vendimi",
          "value": "Pranuar për shqyrtim 21.09.2023 (Komiteti Helsinkit + Drini i Zi); pretendim për shkelje të barazisë e lirisë ekonomike. Gjykata i rrëzoi pretendimet kryesore, ligji në përputhje me Kushtetutën",
          "statusKey": "gjykate",
          "source": "Bankwatch; Balkan Green Energy News; SCAN TV"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "CEE Bankwatch — faqja e projektit HEC Skavica (kapaciteti, kostot, financimi, ndikimi social)",
          "url": "https://bankwatch.org/project/skavica-hydropower-plant-albania"
        },
        {
          "kind": "mediatik",
          "label": "CEE Bankwatch — njoftim: Gjykata Kushtetuese pranon ankesën ndaj ligjit special për Bechtel",
          "url": "https://bankwatch.org/press_release/skavica-mega-dam-albanian-court-to-scrutinise-special-law-for-u-s-contractor-bechtel"
        },
        {
          "kind": "zyrtar",
          "label": "Bechtel — njoftim zyrtar për nënshkrimin e kontratës me qeverinë shqiptare (6 korrik 2021)",
          "url": "https://www.bechtel.com/press-releases/bechtel-signs-contract-with-albanian-government-for-skavica-hydro-project/"
        },
        {
          "kind": "mediatik",
          "label": "Balkan Green Energy News — mjedisorët çojnë Skavicën në Gjykatën Kushtetuese",
          "url": "https://balkangreenenergynews.com/environmentalists-take-hydropower-project-skavica-in-albania-to-constitutional-court/"
        },
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN) — pranimi i ankesës nga Gjykata Kushtetuese, 21 shtator 2023",
          "url": "https://www.reporter.al/2023/09/21/hidrocentrali-i-skavices-pranimi-i-ankeses-nga-gjykata-kushtetuese-rikthen-shpresen-tek-mjedisoret/"
        }
      ],
      "note": "Shifra kryesore (mbi 1 miliard euro / ~1.5 miliardë USD) është kosto e parashikuar e projektit, jo para të paguara dhe jo dëm i konfirmuar nga gjykata ose auditim; pagesa e konfirmuar deri tani është vetëm Faza 1 e studimit (~16 mln euro). Asnjë akuzë penale dhe asnjë vendim përfundimtar gjyqësor që cilëson dëm financiar; vlen prezumimi i pafajësisë."
    },
    {
      "id": "vlora-thermal-power-plant",
      "sector": "Energji / prodhim energjie elektrike",
      "year": "2004–2026",
      "value": 110000000,
      "shortTitle": "TEC-i i Vlorës — kurrë në punë",
      "title": "Termocentrali i Vlorës (TEC Vlora): një investim ~110 milionë euro që nuk ka punuar asnjë ditë",
      "valueLabel": "Kredia e sindikuar EBRD/Banka Botërore (IDA)/BEI e vitit 2004 për ndërtimin",
      "blurb": "Një termocentral 97 MW me cikël të kombinuar në Vlorë, i financuar me një kredi të sindikuar prej ~110 milionë eurosh (EBRD, Banka Botërore/IDA dhe BEI, 2004) dhe i ndërtuar nga italianët Tecnimont, u përfundua në tetor 2011 por nuk ka prodhuar asnjë kilovat-orë. Pas një defekti në sistemin e ftohjes me ujë deti — i lidhur me një stuhi në janar 2012 — impianti është mbajtur i konservuar për më shumë se një dekadë, me një kosto vjetore të raportuar rreth 6 milionë euro (kësti i kredisë plus mirëmbajtja). Mediat dhe raporte konfidenciale e vlerësojnë barrën totale drejt 160 milionë eurosh e më tej. Banka Botërore raportohet të ketë pranuar se fondet nuk do të rikuperohen. Nuk ka çështje penale të konfirmuar.",
      "summary": "TEC-i i Vlorës është një termocentral me cikël të kombinuar 97 MW, pronë e KESH, i destinuar fillimisht të punonte me naftë me mundësi konvertimi në gaz. Investimi u mbështet nga një kredi e sindikuar prej rreth 110 milionë eurosh e nënshkruar në 2004 nga Banka Evropiane për Rindërtim e Zhvillim (EBRD), Banka Botërore (IDA) dhe Banka Evropiane e Investimeve (BEI; pjesa e saj 40 milionë euro, nënshkruar më 29 shtator 2004). Kontrata EPC u nënshkrua në shkurt 2007 me kompaninë italiane Tecnimont; ndërtimi u përfundua në tetor 2011. Faqja zyrtare e KESH e vlerëson projektin në 130 milionë euro. Megjithatë, impianti nuk ka punuar asnjë ditë: gjatë testimeve në 2009 u zbulua një problem me marrjen e ujit të ftohjes, dhe në janar 2012 një defekt/stuhi dëmtoi tubacionin e ftohjes me ujë deti, duke e lënë impiantin në konservim. Kostoja vjetore për ta mbajtur jashtë funksionit raportohet rreth 6 milionë euro (rreth 5 milionë kësti i kredisë + rreth 1 milion mirëmbajtja); mediat dhe raporte konfidenciale e vlerësojnë barrën kumulative drejt 160 milionë eurosh, me tituj që e çojnë drejt 200 milionë. Riparimi me konvertim në gaz është vlerësuar nga konsulentë rreth 13 milionë euro, ndërsa një tender koncesioni në 2017 e vendosi investimin e nevojshëm rreth 58,7 milionë euro; përpjekjet për koncesion në 2018–2019 dështuan. Në mars 2024 qeveria njoftoi një plan konvertimi në LNG me kapacitet 350 MW, të udhëhequr nga kompania amerikane Excelerate Energy. Banka Botërore raportohet të ketë pranuar se fondet e investuara nuk do të rikuperohen. Nuk ka çështje penale të konfirmuar; rasti mbetet kryesisht një humbje e dokumentuar e parave publike dhe një projekt i dështuar zhvillimor.",
      "status": [
        "kontrate",
        "zyrtar",
        "mediatik",
        "proces"
      ],
      "facts": [
        {
          "label": "Kredia e sindikuar për ndërtimin (2004)",
          "value": "~110 milionë euro nga EBRD, Banka Botërore (IDA) dhe BEI; pjesa e BEI 40 milionë euro, nënshkruar më 29 shtator 2004. Faqja zyrtare e KESH e vlerëson projektin në 130 milionë euro.",
          "statusKey": "kontrate",
          "source": "Bankwatch; faqja zyrtare e KESH; Banka Evropiane e Investimeve (eib.org)"
        },
        {
          "label": "Statusi: kurrë në punë / i konservuar",
          "value": "Përfunduar tetor 2011 (EPC me Tecnimont, shkurt 2007). Problem me marrjen e ujit të ftohjes në testimet 2009; defekt/stuhi në janar 2012 dëmtoi tubacionin e ftohjes me ujë deti. Nuk ka prodhuar asnjë ditë; mbahet në konservim nga KESH.",
          "statusKey": "zyrtar",
          "source": "Faqja zyrtare e KESH; Bankwatch"
        },
        {
          "label": "Kosto vjetore e mbajtjes jashtë funksionit",
          "value": "Rreth 6 milionë euro/vit (rreth 5 milionë kësti i kredisë + rreth 1 milion mirëmbajtje). Barra kumulative raportohet drejt 160 milionë eurosh, me tituj drejt 200 milionëve.",
          "statusKey": "mediatik",
          "source": "Monitor.al; VoxNews (raport konfidencial)"
        },
        {
          "label": "Riparim / konvertim në gaz / koncesion",
          "value": "Riparim + konvertim në gaz vlerësuar ~13 milionë euro nga konsulentët; tender koncesioni 2017 ~58,7 milionë euro; koncesionet 2018–2019 dështuan. Mars 2024: plan konvertimi në LNG 350 MW me Excelerate Energy.",
          "statusKey": "proces",
          "source": "Monitor.al; Open Procurement Albania; LNG Prime / Global Energy Monitor"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "Bankwatch — Vlora Industrial and Energy Park / Vlora Thermo Power Plant",
          "url": "https://bankwatch.org/project/vlora-industrial-and-energy-park-albania"
        },
        {
          "kind": "zyrtar",
          "label": "KESH — faqja zyrtare e aktivit TEC Vlora",
          "url": "https://www.kesh.al/en/asset/tec-vlora/"
        },
        {
          "kind": "zyrtar",
          "label": "Banka Evropiane e Investimeve — projekti Vlore Thermal Power Plant (kredia 40M€, 2004)",
          "url": "https://www.eib.org/en/projects/all/20020080"
        },
        {
          "kind": "mediatik",
          "label": "Monitor.al — TEC-i i Vlorës, një 'kufomë energjetike'",
          "url": "https://monitor.al/en/tec-i-i-vlores-nje-kufome-energjetike/"
        },
        {
          "kind": "mediatik",
          "label": "VoxNews — KESH 'hedh në kosh' mbi 160 milionë euro (raport konfidencial)",
          "url": "https://www.voxnews.al/english/fokus/kesh-hedh-ne-kosh-mbi-160-milione-euro-si-la-deri-ne-degradim-te-plote-tec-i60424"
        }
      ],
      "note": "Shifrat ndryshojnë sipas bazës: 110 milionë euro = vlera e kredisë së ndërtimit (zyrtare); ~130 milionë = vlera e projektit sipas KESH; ~160–200 milionë = barra totale e raportuar (kredi + interesa + konservim) sipas mediave. Nuk ka vendim gjyqësor të formës së prerë; \"dëmi\" nuk është konfirmuar nga drejtësia."
    },
    {
      "id": "bankers-petroleum-patos-marinza",
      "sector": "Naftë dhe gaz (koncesion hidrokarburesh)",
      "year": "2004–2026",
      "value": 220000000,
      "buildable": false,
      "valueKind": "Fitore e shtetit — pretendime të refuzuara nga arbitrazhi, jo para publike të humbura.",
      "shortTitle": "Bankers Petroleum — Patos-Marinëz (arbitrazhi ICC)",
      "title": "Bankers Petroleum — fusha e naftës Patos-Marinëz: mosmarrëveshja për kostot e rikuperueshme (arbitrazhi ICC) dhe gjoba tatimore prej rreth 120 milionë eurosh",
      "valueLabel": "Kosto të rikuperueshme të refuzuara nga arbitrazhi ICC (mbi 236 mln USD ≈ 220 mln EUR)",
      "blurb": "Gjykata Ndërkombëtare e Arbitrazhit (ICC, Paris) refuzoi pretendimet e Bankers Petroleum për rikuperimin e mbi 236 milionë dollarëve (rreth 220 milionë euro) kosto në fushën Patos-Marinëz, duke pranuar interpretimin e shtetit shqiptar të Marrëveshjes Hidrokarbure të vitit 2004. Një fitore e rrallë e shtetit në arbitrazh, që pritet të rrisë fitimin historik të fushës dhe bazën e tatimit mbi fitimin. Veçmas, një gjobë tatimore/akcize prej rreth 120 milionë eurosh — më e larta e vendosur ndonjëherë në Shqipëri, e mbajtur në fuqi nga Gjykata e Lartë — raportohet ende kryesisht e paarkëtuar.",
      "summary": "Bankers Petroleum (që nga 2016 në pronësi të grupit kinez Geo-Jade Petroleum) është operatore e fushës së naftës Patos-Marinëz bazuar në Marrëveshjen e Licencës dhe Marrëveshjen Hidrokarbure të nënshkruar më 15 prill 2004 me shtetin shqiptar (nëpërmjet AKBN/Agjencisë Kombëtare të Burimeve Natyrore dhe Albpetrol).\n\nMosmarrëveshja e arbitrazhit (Çështja ICC Nr. 21349/GR) u ngrit nga vetë Bankers lidhur me procedurat e rikuperimit të kostove sipas marrëveshjes së 2004-s. Më 7 qershor 2024 (vendimi u lëshua më 18 qershor; pala shqiptare Albpetrol e bëri publike rreth 27 qershor 2024), tribunali i ICC-së refuzoi si të parikuperueshme kosto në vlerë mbi 236 milionë dollarë (rreth 220 milionë euro) që Bankers kërkonte t'i njihte ndaj fushës, duke pranuar interpretimin e shtetit se kategoritë e kostove të rikuperueshme janë të kufizuara. Tribunali rrëzoi gjithashtu kundërpadi të AKBN-së dhe Albpetrol. Shteti e paraqet këtë si fitore me precedent për llogaritjen e tatimit mbi fitimin në Patos-Marinëz dhe asete të ngjashme. Duhet theksuar se i njëjti vendim e detyroi palën shqiptare të paguajë rreth 5,76 milionë dollarë kosto procedurale, dhe se vetë kompania e ka paraqitur rezultatin si \"sukses thelbësor\" me pjesën më të madhe të shpenzimeve të njohura si të rikuperueshme — pra fitorja është reale për shtetin, por jo absolute. Vlera 236 mln USD është shuma e pretendimeve të refuzuara, jo para të fituara nga shteti.\n\nVeçmas dhe pavarësisht arbitrazhit, ekziston një mosmarrëveshje tatimore/akcize lidhur me \"holluesin\" (diluent) e përdorur në prodhimin e naftës së rëndë. Pas kontrolleve doganore (2017 e në vijim), detyrimi me gjoba arriti rreth 12,48 miliardë lekë (rreth 120 milionë euro) — cilësuar si gjoba më e lartë e vendosur ndonjëherë në Shqipëri. Gjykata e Lartë e la në fuqi thelbin e detyrimit në 2022 (dhe një çështje të dytë në dhjetor 2025). Sipas Ministrit të Financave (deklaratë në Kuvend, 11 qershor 2026), kompania nuk kishte në llogari shumën e plotë, ndaj u ra dakord për një plan pagese me këste për rreth 3 miliardë lekë; deri tani raportohet e arkëtuar vetëm rreth 1,5 milionë dollarë. Pra gjoba mbetet kryesisht e paarkëtuar.",
      "status": [
        "arbitrazh",
        "kontrate",
        "gjykate",
        "proces"
      ],
      "facts": [
        {
          "label": "Marrëveshja Hidrokarbure / e Licencës për Patos-Marinëz (operatore Bankers Petroleum)",
          "value": "Nënshkruar më 15 prill 2004 me AKBN dhe Albpetrol; afat 25-vjeçar; fusha më e madhe e naftës tokësore në Evropën kontinentale.",
          "statusKey": "kontrate",
          "source": "Wikipedia (përmbledhje, burim sekondar)"
        },
        {
          "label": "Kosto të rikuperueshme të refuzuara nga arbitrazhi ICC (Çështja Nr. 21349/GR)",
          "value": "Mbi 236 milionë USD (rreth 220 milionë euro) pretendime kostosh të refuzuara si të parikuperueshme; vendimi përfundimtar 7 qershor 2024, pranuar interpretimi i shtetit shqiptar.",
          "statusKey": "arbitrazh",
          "source": "SeeNews / Albania Daily News (Albpetrol); deklaratë e vetë Bankers Petroleum"
        },
        {
          "label": "Kosto procedurale që pala shqiptare u detyrua të paguajë në të njëjtin vendim ICC",
          "value": "Rreth 5,76 milionë USD në ngarkim të palës shqiptare (nuancë që zbut fitoren).",
          "statusKey": "arbitrazh",
          "source": "VoxNews (raportim mbi vendimin ICC 21349/GR)"
        },
        {
          "label": "Gjoba tatimore/akcize (mosmarrëveshja e 'holluesit'), e ndarë nga arbitrazhi",
          "value": "Detyrim me gjoba rreth 12,48 miliardë lekë (~120 mln euro), gjoba më e lartë në Shqipëri; mbajtur në fuqi nga Gjykata e Lartë (2022); deri qershor 2026 raportohet e arkëtuar vetëm ~1,5 mln USD.",
          "statusKey": "gjykate",
          "source": "inAlbania (deklaratë e Ministrit të Financave në Kuvend, 11 qershor 2026)"
        }
      ],
      "sources": [
        {
          "kind": "mediatik",
          "label": "SeeNews — ICC rules in favour of Albania in Bankers Petroleum dispute (Albpetrol)",
          "url": "https://seenews.com/news/icc-rules-in-favour-of-albania-in-bankers-petroleum-dispute-albpetrol-1259759"
        },
        {
          "kind": "mediatik",
          "label": "Albania Daily News — ICC Rules in Favour of Albania in Bankers Petroleum Dispute (Albpetrol)",
          "url": "https://albaniandailynews.com/news/icc-rules-in-favour-of-albania-in-bankers-petroleum-dispute---albpetrol"
        },
        {
          "kind": "mediatik",
          "label": "Bankers Petroleum — ICC Tribunal issues Final Award in Cost-Recovery Arbitration (deklaratë e kompanisë, Çështja ICC Nr. 21349)",
          "url": "https://bankerspetroleum.com/icc-tribunal-issues-final-award-in-cost-recovery-arbitration/"
        },
        {
          "kind": "mediatik",
          "label": "inAlbania — Finance minister outlines legal process in Bankers Petroleum tax dispute (gjoba ~120 mln EUR, arkëtimi)",
          "url": "https://www.inalbania.info/finance-minister-outlines-legal-process-in-bankers-petroleum-tax-dispute/"
        },
        {
          "kind": "mediatik",
          "label": "VoxNews — Bankers Petroleum, miliona euro humbje (detaje për Çështjen ICC 21349/GR dhe koston procedurale)",
          "url": "https://www.voxnews.al/english/biznes/bankers-petroleum-miliona-euro-humbje-per-shtetin-jo-vetem-taksa-te-papag-i109583"
        }
      ],
      "note": "Shifra titullare (mbi 236 mln USD ≈ 220 mln EUR) është vlera e pretendimeve të kostove të refuzuara nga arbitrazhi ICC, jo para të fituara/të arkëtuara nga shteti; vendimi i 7 qershorit 2024 është formë e prerë, por i njëjti vendim ngarkoi palën shqiptare me ~5,76 mln USD kosto procedurale dhe vetë kompania e quan rezultatin 'sukses thelbësor'. Gjoba tatimore ~120 mln EUR është çështje krejt e ndarë nga arbitrazhi."
    },
    {
      "id": "adriatic-ionian-road-ppp-program",
      "sector": "Infrastrukturë rrugore (koncesione/PPP)",
      "year": "2018–2024 (kontrata 2022–2023, afate 35-vjeçare)",
      "value": 1020000000,
      "shortTitle": "Koncesionet rrugore të Korridorit Adriatik-Jon",
      "title": "Programi i koncesioneve rrugore të Korridorit Adriatik-Jon (Kashar–Lekaj–Fier dhe Thumanë–Vorë–Kashar)",
      "valueLabel": "Vlera e përgjithshme e investimit të tre koncesioneve (pa TVSH)",
      "blurb": "Një grup koncesionesh rrugore 35-vjeçare të miratuara në 2022–2023 për segmente të Korridorit Adriatik-Jon, të nisura kryesisht nga propozime të pakërkuara, me kosto për kilometër ndër më të lartat në rajon, pa konkurrencë reale ndërkombëtare dhe me garanci shtetërore të të ardhurave nga trafiku që kalojnë 100 milionë euro.",
      "summary": "Qeveria shqiptare miratoi në vitet 2022–2023 një grup koncesionesh/PPP me afat 35-vjeçar për ndërtimin dhe operimin e segmenteve rrugore të Korridorit Adriatik-Jon: Kashar–Pezë–Lekaj me vlerë investimi rreth 474,87 milionë euro (pa TVSH, ~26,6 km, fitues bashkimi i operatorëve me kryesues \"Gjoka Konstruksion\", shpallur fitues më 13.02.2023); Lekaj–Konjat–Fier me vlerë rreth 320 milionë euro (~46 km, bashkim 8-operatorësh me kryesues \"Fusha\" sh.p.k., shpallur fitues më 14.11.2022, me vetëm një ofertë të paraqitur); dhe Thumanë–Vorë–Kashar me vlerë rreth 225,82 milionë euro pa TVSH (rreth 271 milionë euro me TVSH, ~20–21 km, \"Gener 2\"/\"G2 Infra\", propozim i pakërkuar i vitit 2018 i riaktivizuar në 2022, hapur për qarkullim qershor 2024). Sipas analizës së Open Data Albania (ndiqparate.al) dhe raportimeve të Monitor.al, kostot për kilometër janë deri rreth 2–2,5 herë më të larta se studimet e fisibilitetit dhe referencat ndërkombëtare, procedurat nuk tërhoqën konkurrentë të huaj, dhe shteti ka marrë përsipër garanci për të ardhurat nga trafiku që në total kalojnë 100 milionë euro (rreth 48,5 mln euro për Kashar–Pezë–Lekaj, 32,5 mln euro për Lekaj–Konjat–Fier dhe 22,81 mln euro për Thumanë–Vorë–Kashar). Sipas raportimeve të dhjetorit 2025 (BIRN/Shqiptarja.com), koncesioni Thumanë–Vorë–Kashar (Gener 2) është ndër tenderët që preken nga hetimi i SPAK, ku zëvendëskryeministrja Belinda Balluku është nën hetim/dyshohet — por për këtë koncesion nuk ka akuzë formale, as vendim gjyqësor, dhe vlen prezumimi i pafajësisë. Dy segmentet e tjera (Kashar–Pezë–Lekaj dhe Lekaj–Konjat–Fier) nuk janë konfirmuar brenda dosjes penale. Mbi të gjitha, ky mbetet një grup me ekspozim fiskal të lartë i dokumentuar nga të dhënat e hapura dhe gazetaria investigative, jo një dëm i provuar nga gjykata.",
      "status": [
        "kontrate",
        "zyrtar",
        "spak",
        "klsh",
        "proces",
        "mediatik"
      ],
      "facts": [
        {
          "label": "Kashar–Pezë–Lekaj — vlera e investimit (pa TVSH)",
          "value": "≈ 474,87 milionë euro; ~26,6 km; koncesion 35-vjeçar; fitues bashkimi i operatorëve me kryesues \"Gjoka Konstruksion\", shpallur fitues më 13.02.2023",
          "statusKey": "kontrate",
          "source": "Open Procurement Albania, koncesioni id/33; Open Data Albania (ndiqparate.al)"
        },
        {
          "label": "Lekaj–Konjat–Fier — vlera e investimit (pa TVSH)",
          "value": "≈ 320 milionë euro; ~46 km; koncesion 35-vjeçar; bashkim 8-operatorësh me kryesues \"Fusha\" sh.p.k., shpallur fitues më 14.11.2022, me vetëm një ofertë (pa konkurrencë të huaj)",
          "statusKey": "kontrate",
          "source": "Open Procurement Albania, koncesioni id/34; Open Data Albania (ndiqparate.al)"
        },
        {
          "label": "Thumanë–Vorë–Kashar — vlera e investimit",
          "value": "≈ 225,82 milionë euro pa TVSH (≈ 271 milionë euro me TVSH); ~20–21 km; koncesion 35-vjeçar; \"Gener 2\"/\"G2 Infra\"; propozim i pakërkuar i 2018 i riaktivizuar në 2022; hapur për qarkullim qershor 2024",
          "statusKey": "kontrate",
          "source": "Open Data Albania (ndiqparate.al); Revista Monitor"
        },
        {
          "label": "Garancitë shtetërore të të ardhurave nga trafiku (totali)",
          "value": "Mbi 100 milionë euro në total: ~48,5 mln euro (Kashar–Pezë–Lekaj), ~32,5 mln euro (Lekaj–Konjat–Fier), ~22,81 mln euro (Thumanë–Vorë–Kashar, 8 vitet e para). Kosto për km e raportuar deri ~2–2,5 herë mbi studimet e fisibilitetit.",
          "statusKey": "mediatik",
          "source": "Open Data Albania (ndiqparate.al); Revista Monitor"
        },
        {
          "label": "Statusi penal (dyshime, dhjetor 2025)",
          "value": "Koncesioni Thumanë–Vorë–Kashar raportohet ndër tenderët që preken nga hetimi i SPAK ndaj zv/kryeministres Belinda Balluku (nën hetim/dyshim). Pa akuzë formale e pa vendim për këtë koncesion — prezumimi i pafajësisë. Segmentet e tjera nuk konfirmohen në dosje.",
          "statusKey": "spak",
          "source": "Reporter.al (BIRN); Shqiptarja.com (dhjetor 2025)"
        }
      ],
      "sources": [
        {
          "kind": "zyrtar",
          "label": "Open Procurement Albania — Koncesioni Kashar–Pezë–Lekaj (id/33)",
          "url": "https://www.openprocurement.al/sq/concession/view/id/33"
        },
        {
          "kind": "zyrtar",
          "label": "Open Procurement Albania — Koncesioni Lekaj–Konjat–Fier (id/34)",
          "url": "https://openprocurement.al/sq/concession/view/id/34"
        },
        {
          "kind": "zyrtar",
          "label": "Open Data Albania (ndiqparate.al) — Projekti Milot–Fier / Korridori Rrugor Adriatik-Jon me PPP",
          "url": "https://ndiqparate.al/?p=21595&lang=en"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Gjurma shqiptare e korridorit Adriatiko-Jonian dhe kostot 2.5 herë më të larta me PPP",
          "url": "https://monitor.al/gjurma-shqiptare-e-korridorit-adriatiko-jonian-dhe-dritehijet-e-kostove-2/"
        },
        {
          "kind": "mediatik",
          "label": "Revista Monitor — Koncesioni 1.3 miliardë euro i Thumanë–Kashar (detajet mjedisore, gjurma)",
          "url": "https://monitor.al/koncesioni-1-3-miliarde-euro-i-thumane-kashar-dorezon-detajet-mjedisore-ku-do-kaloje-gjurma/"
        },
        {
          "kind": "mediatik",
          "label": "Reporter.al (BIRN) — Çfarë akuzohet Belinda Balluku (hetimi i tenderëve)",
          "url": "https://www.reporter.al/2025/11/24/unaza-e-madhe-konkurrenca-e-vogel-per-cfare-akuzohet-belinda-balluku/"
        },
        {
          "kind": "mediatik",
          "label": "Shqiptarja.com — Dosja Balluku: SPAK në verifikim të tenderëve",
          "url": "https://shqiptarja.com/lajm/dosja-balluku-spak-ne-verifikim-te-gjithe-tenderet-per-7-lotet-e-unazes-se-madhe-dyshime-se-u-paracaktuan-fituesit-priten-te-tjere-te-pandehur"
        }
      ],
      "note": "Shifrat janë vlera kontraktuale/investimi (pa TVSH ku tregohet), jo para publike të paguara apo dëme të vërtetuara. Vlera ~1.02 mld euro është shumë e tre koncesioneve (jo një shifër e vetme nga një burim i vetëm). Garancitë shtetërore janë detyrime të kushtëzuara, jo shpenzime të kryera. Nuk ka vendim gjyqësor të formës së prerë; sipas raportimeve të dhjetorit 2025, segmenti Thumanë–Vorë–Kashar preket nga hetimi i SPAK (Balluku) — prezumimi i pafajësisë."
    }
  ];

  const sourceTypes = [
    { kind: "zyrtar", title: "Open Procurement Albania / Regjistri i koncesioneve", desc: "Të dhëna të hapura për kontrata, tenderë e koncesione (openprocurement.al, open.data.al, ndiqparate.al)." },
    { kind: "klsh", title: "Raporte auditimi — KLSH", desc: "Gjetje e vlerësime nga Kontrolli i Lartë i Shtetit (klsh.org.al)." },
    { kind: "spak", title: "Njoftime & dosje — SPAK / GJKKO", desc: "Akte e njoftime të Prokurorisë së Posaçme dhe vendime të Gjykatës së Posaçme — të formës së prerë ose në proces." },
    { kind: "gjykate", title: "Vendime gjykate & arbitrazhi ndërkombëtar", desc: "Vendime gjyqësore dhe vendime arbitrazhi ICSID/ICC (italaw.com, jusmundi.com)." },
    { kind: "mediatik", title: "Gazetari investigative", desc: "Hulumtime të BIRN/Reporter.al, Balkan Insight, OCCRP, Monitor e të tjera — të cilësuara qartë si burim mediatik." },
  ];

  const navDef = [
    { key: "home", label: "Ballina", screen: "home" },
    { key: "cases", label: "Rastet", screen: "cases" },
    { key: "calc", label: "Krahaso", screen: "calc" },
    { key: "method", label: "Metodologjia", screen: "method" },
    { key: "sources", label: "Burimet", screen: "sources" },
  ];

  // ---------- HELPERS ----------

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const fmt = (n) => "€" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fmtInt = (n) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  function counts(a) {
    const out = {};
    for (const k in units) out[k] = fmtInt(a / units[k]);
    return out;
  }

  function statusChips(keys) {
    return keys.map((k) => {
      const m = statusMeta[k];
      const style = `display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;color:${m.c};background:${m.c}1f;border:1px solid ${m.c}55;`;
      return `<span style="${style}">${esc(m.text)}</span>`;
    }).join("");
  }

  function srcChip(kind) {
    const m = statusMeta[kind] || statusMeta.mediatik;
    const style = `display:inline-flex;align-items:center;padding:4px 9px;border-radius:7px;font-size:10.5px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;white-space:nowrap;color:${m.c};background:${m.c}1f;border:1px solid ${m.c}44;`;
    return { kindLabel: m.text, style };
  }

  function iconSvg(d, size, stroke) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"></path></svg>`;
  }

  // ---------- ROUTING (query-param, deep-linkable & crawlable) ----------
  const PATH = location.pathname;                 // base path (handles "/" or subpath hosting)
  const CANON = "https://deshmi-com.github.io/mundteishte";          // canonical origin — replace if the domain differs
  const screenSlug = { home: "", cases: "rastet", calc: "krahaso", method: "metodologjia", sources: "burimet" };
  const slugScreen = { "": "home", rastet: "cases", krahaso: "calc", metodologjia: "method", burimet: "sources" };

  function relUrl(screen, caseId) {
    if (screen === "case") return PATH + "?rast=" + encodeURIComponent(caseId || "");
    const slug = screenSlug[screen];
    return PATH + (slug ? "?faqe=" + slug : "");
  }
  function canonUrl() {
    if (state.screen === "case") return CANON + "/?rast=" + encodeURIComponent(state.caseId);
    const slug = screenSlug[state.screen];
    return CANON + "/" + (slug ? "?faqe=" + slug : "");
  }
  function applyUrl() {
    const q = new URLSearchParams(location.search);
    const rast = q.get("rast");
    if (rast) {
      const c = cases.find((x) => x.id === rast);
      if (c) { state.screen = "case"; state.caseId = c.id; return; }
    }
    state.screen = slugScreen[q.get("faqe") || ""] || "home";
  }

  function titleFor() {
    const base = "Mund të Ishte";
    if (state.screen === "case") {
      const c = cases.find((x) => x.id === state.caseId);
      if (c) return c.shortTitle + " — " + base;
    }
    const labels = { cases: "Rastet", calc: "Krahaso", method: "Metodologjia", sources: "Burimet" };
    return labels[state.screen] ? labels[state.screen] + " — " + base : base;
  }
  function descFor() {
    const def = "Sa para publike u harxhuan keq në Shqipëri — dhe çfarë mund të ishte ndërtuar a financuar me to. 21 raste të dokumentuara, me burime.";
    if (state.screen === "case") {
      const c = cases.find((x) => x.id === state.caseId);
      if (c && c.blurb) return c.blurb.slice(0, 180);
    }
    return def;
  }
  function setMeta(id, attr, val) { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); }
  function updateMeta() {
    const t = titleFor(), u = canonUrl(), d = descFor();
    document.title = t;
    setMeta("m-canonical", "href", u);
    setMeta("m-ogurl", "content", u);
    setMeta("m-ogtitle", "content", t);
    setMeta("m-desc", "content", d);
  }

  function navigate(url) { history.pushState({}, "", url); applyUrl(); render(); scrollTop(); }
  function go(screen) { navigate(relUrl(screen)); }
  function open(id) { navigate(relUrl("case", id)); }
  function scrollTop() { try { window.scrollTo(0, 0); } catch (e) {} }

  // ---------- SHARED PIECES ----------

  const recurrenceSuffix = { vjetore: "/ vit", mujore: "/ muaj" };
  function buildCounts(amount) {
    const cnt = counts(amount);
    return catalogMeta.map((m) => {
      const rec = (unitMeta[m.key] || {}).recurrence;
      return {
        label: m.label, icon: icons[m.key], count: cnt[m.key], unitFmt: fmt(units[m.key]),
        unitSuffix: recurrenceSuffix[rec] || "/ njësi",
      };
    });
  }

  function header() {
    const activeScreen = state.screen === "case" ? "cases" : state.screen;
    const navBtns = navDef.map((n, i) => {
      const on = n.screen === activeScreen;
      const style = `background:${on ? "rgba(210,59,59,0.16)" : "none"};border:1px solid ${on ? "rgba(210,59,59,0.4)" : "transparent"};color:${on ? "#f0b4af" : "#9b9da3"};border-radius:9px;padding:8px 13px;font-family:'Hanken Grotesk';font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap;`;
      return `<button data-go="${n.screen}"${on ? ' aria-current="page"' : ''} style="${style}">${esc(n.label)}</button>`;
    }).join("");

    return `
    <header style="position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);background:rgba(14,14,16,0.82);border-bottom:1px solid rgba(255,255,255,0.07);">
      <div style="max-width:1240px;margin:0 auto;padding:13px clamp(16px,4vw,28px);display:flex;align-items:center;gap:18px;justify-content:space-between;">
        <button data-go="home" style="flex:none;display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer;padding:0;text-align:left;">
          <span style="width:34px;height:34px;flex:none;border-radius:9px;background:linear-gradient(150deg,#d23b3b,#7a2222);display:flex;align-items:center;justify-content:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V8l7-5 7 5v13"></path><path d="M9 21v-6h6v6"></path></svg>
          </span>
          <span style="display:flex;flex-direction:column;line-height:1.05;">
            <span style="font-family:'Spectral',serif;font-weight:700;font-size:18px;color:#F3F1EB;letter-spacing:-0.01em;">Mund të Ishte</span>
            <span class="hide-sm" style="font-size:10.5px;font-weight:600;color:#8b8d93;letter-spacing:0.01em;">Para publike vs. çfarë i duhej Shqipërisë</span>
          </span>
        </button>
        <nav class="no-scrollbar" style="display:flex;gap:4px;overflow-x:auto;min-width:0;padding:2px;margin:-2px;">
          ${navBtns}
        </nav>
      </div>
      <div style="background:rgba(210,59,59,0.07);border-top:1px solid rgba(210,59,59,0.16);">
        <div style="max-width:1240px;margin:0 auto;padding:6px clamp(16px,4vw,28px);display:flex;align-items:center;gap:8px;font-size:11.5px;color:#c79a96;letter-spacing:0.02em;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 9v4"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="9"></circle></svg>
          <span style="font-weight:600;text-transform:uppercase;">Të dhëna nga burime publike</span>
          <span>·  Çdo shifër mban etiketën e statusit dhe burimin. Për çështjet në hetim vlen prezumimi i pafajësisë; krahasimet janë ilustruese.</span>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    const links = navDef.map((n) =>
      `<button data-go="${n.screen}" class="foot-link" style="background:none;border:none;color:#9b9da3;font-family:'Hanken Grotesk';font-size:13.5px;cursor:pointer;text-align:left;padding:0;">${esc(n.label)}</button>`
    ).join("");
    return `
    <footer style="border-top:1px solid rgba(255,255,255,0.07);background:#0b0b0d;">
      <div style="max-width:1240px;margin:0 auto;padding:40px clamp(16px,4vw,28px);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;align-items:start;">
        <div>
          <div style="font-family:'Spectral',serif;font-weight:700;font-size:17px;color:#F0EEE7;margin-bottom:4px;">Mund të Ishte</div>
          <div style="font-size:12px;color:#8b8d93;margin-bottom:10px;">Para publike vs. çfarë i duhej Shqipërisë</div>
          <p style="font-size:13px;color:#7e8086;line-height:1.6;margin:0;max-width:34ch;">Platformë e pavarur llogaridhënieje publike. Të dhëna nga burime publike, të etiketuara me status e burim; krahasimet janë ilustruese.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;">${links}</div>
        <div style="font-size:12.5px;color:#8b8d93;line-height:1.6;">Burime publike · 2026<br>Krahasimet janë ilustruese.<br>Nuk është faqe partie politike.</div>
      </div>
    </footer>`;
  }

  // ---------- SCREENS ----------

  function caseCard(c) {
    return `
    <button data-open="${c.id}" class="card-hover" style="text-align:left;cursor:pointer;background:#15171a;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <span style="font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7e8086;">${esc(c.sector)}</span>
        <span style="font-size:12px;color:#8b8d93;" class="tnum">${esc(c.year)}</span>
      </div>
      <div>
        <div style="font-family:'Spectral',serif;font-weight:700;font-size:1.9rem;color:#F3F1EB;letter-spacing:-0.01em;line-height:1;" class="tnum">${esc(fmt(c.value))}</div>
        <div style="font-size:12.5px;color:#8b8d93;margin-top:5px;">${esc(c.valueLabel)}</div>
      </div>
      <div style="font-family:'Spectral',serif;font-size:1.18rem;font-weight:600;color:#E6E3DC;line-height:1.2;letter-spacing:-0.01em;">${esc(c.title)}</div>
      <p style="font-size:13.5px;color:#9b9da3;line-height:1.5;margin:0;flex:1;">${esc(c.blurb)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${statusChips(c.status)}</div>
    </button>`;
  }

  function screenHome() {
    const feat = cases[0];
    const fc = counts(feat.value);
    const heroChips = [
      { n: fc.spitale, label: "Spital rajonal" },
      { n: fc.shkolla, label: "Shkolla 9-vjeçare" },
      { n: fc.km, label: "km rrugë të asfaltuara" },
    ];
    const buildableCases = cases.filter((c) => c.buildable !== false);
    const totalLoss = buildableCases.reduce((s, c) => s + c.value, 0);
    const tc = counts(totalLoss);
    const totalChips = [
      { n: tc.spitale, label: "Spitale rajonale" },
      { n: tc.shkolla, label: "Shkolla 9-vjeçare" },
      { n: tc.uje, label: "Qytete me ujë 24-orësh" },
    ];

    return `
    <section style="">
      <!-- HERO -->
      <div style="padding:clamp(40px,7vw,84px) 0 clamp(30px,4vw,44px);max-width:820px;">
        <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(1.6rem,4.2vw,2.6rem);line-height:1.12;letter-spacing:-0.02em;color:#F3F1EB;margin:0 0 18px;max-width:20ch;">Sa para publike u harxhuan keq në Shqipëri — dhe çfarë mund të ishte ndërtuar me to.</h1>
        <p style="font-size:clamp(15px,1.7vw,17px);line-height:1.55;color:#a8aab0;max-width:60ch;margin:0 0 30px;">Raste të dokumentuara nga burime publike — kontrata, gjetje auditimi, hetime, vendime gjykate dhe detyrime arbitrazhi. Çdo shifër e shndërrojmë në shërbime që mund të ishin financuar, si krahasim ilustrues.</p>
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border:1px solid rgba(255,255,255,0.12);border-radius:100px;font-size:11.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#b9bbc0;margin-bottom:24px;">
          <span style="width:7px;height:7px;border-radius:50%;background:#d23b3b;"></span> Rasti i përzgjedhur
        </div>
        <div style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2.1rem,9vw,5.6rem);line-height:0.95;letter-spacing:-0.025em;color:#F6F4EE;" class="tnum">${esc(fmt(feat.value))}</div>
        <div style="font-family:'Spectral',serif;font-size:clamp(1.5rem,3.6vw,2.1rem);font-weight:600;color:#ECEAE3;margin:16px 0 10px;letter-spacing:-0.01em;">${esc(feat.title)}</div>
        <p style="font-size:clamp(15px,1.7vw,17px);line-height:1.55;color:#a8aab0;max-width:52ch;margin:0 0 22px;">${esc(feat.valueLabel)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;">${statusChips(feat.status)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;">
          <button data-open="${feat.id}" style="display:inline-flex;align-items:center;gap:9px;background:#d23b3b;color:#fff;border:none;border-radius:11px;padding:14px 22px;font-family:'Hanken Grotesk';font-size:15px;font-weight:700;cursor:pointer;">Shiko rastin
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
          <button data-go="calc" style="display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,0.05);color:#ECEAE3;border:1px solid rgba(255,255,255,0.16);border-radius:11px;padding:14px 22px;font-family:'Hanken Grotesk';font-size:15px;font-weight:600;cursor:pointer;">Eksploro krahasimet</button>
        </div>
      </div>

      <!-- BUILD ROW -->
      <div style="border-top:1px solid rgba(255,255,255,0.08);padding:clamp(28px,4vw,42px) 0;margin-bottom:clamp(40px,6vw,68px);">
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:24px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#56b06a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          <span style="font-size:13.5px;font-weight:600;color:#bdbfc4;">Me këtë shumë mund të financoheshin <span style="color:#7cc78c;">· krahasim ilustrues</span></span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:clamp(22px,3vw,44px);">
          ${heroChips.map((h) => `
            <div>
              <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(2.4rem,5.5vw,3.3rem);color:#7cc78c;line-height:1;" class="tnum">${esc(h.n)}</div>
              <div style="font-size:14.5px;color:#bdbfc4;margin-top:9px;">${esc(h.label)}</div>
            </div>`).join("")}
        </div>
      </div>

      <!-- AGGREGATE BAND -->
      <div style="background:linear-gradient(150deg,rgba(210,59,59,0.12),rgba(210,59,59,0.02));border:1px solid rgba(210,59,59,0.22);border-radius:22px;padding:clamp(24px,4vw,40px);margin-bottom:clamp(40px,6vw,68px);">
        <div style="font-size:12.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#d98f8a;margin-bottom:10px;">Gjithsej në ${esc(String(buildableCases.length))} raste të dokumentuara</div>
        <div style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(1.8rem,8vw,5rem);line-height:0.95;letter-spacing:-0.025em;color:#F6F4EE;" class="tnum">${esc(fmt(totalLoss))}</div>
        <p style="font-size:14.5px;color:#bdbfc4;line-height:1.55;margin:14px 0 0;max-width:66ch;">Shumë e përafërt e vlerave të rasteve (kontrata, gjetje auditimi, projeksione e detyrime — baza ndryshon nga rasti në rast; shih secilin rast). E shprehur si krahasim ilustrues, kjo do të mjaftonte për:</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:clamp(18px,3vw,40px);margin-top:24px;">
          ${totalChips.map((h) => `
            <div>
              <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(2rem,5vw,3rem);color:#7cc78c;line-height:1;" class="tnum">${esc(h.n)}</div>
              <div style="font-size:14px;color:#bdbfc4;margin-top:8px;">${esc(h.label)}</div>
            </div>`).join("")}
        </div>
      </div>

      <!-- FEATURED CASES -->
      <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:22px;">
        <div>
          <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.5rem,3.4vw,2rem);margin:0;color:#F3F1EB;letter-spacing:-0.01em;">Rastet e dokumentuara</h2>
          <p style="margin:8px 0 0;color:#9b9da3;font-size:15px;max-width:60ch;">Çdo rast mban etiketën e statusit: kontratë, gjetje auditimi, hetim, vendim gjykate apo detyrim arbitrazhi.</p>
        </div>
        <button data-go="cases" style="flex:none;background:none;border:1px solid rgba(255,255,255,0.16);color:#ECEAE3;border-radius:10px;padding:10px 16px;font-family:'Hanken Grotesk';font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;">Të gjitha</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;margin-bottom:clamp(40px,6vw,72px);">
        ${cases.map(caseCard).join("")}
      </div>

      <!-- CALC TEASER -->
      <div style="background:#15171a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:clamp(26px,4vw,44px);text-align:center;">
        <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.6rem,4vw,2.4rem);margin:0 0 12px;color:#F3F1EB;letter-spacing:-0.015em;">Çfarë do të kishe ndërtuar ti?</h2>
        <p style="color:#a8aab0;font-size:16px;max-width:54ch;margin:0 auto 26px;line-height:1.55;">Zhvendos shumën dhe shiko në kohë reale sa shkolla, kilometra rrugë ose spitale do të financoheshin.</p>
        <button data-go="calc" style="display:inline-flex;align-items:center;gap:9px;background:#4a9d5b;color:#fff;border:none;border-radius:12px;padding:15px 26px;font-family:'Hanken Grotesk';font-size:15px;font-weight:700;cursor:pointer;">Hap kalkulatorin
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </div>
    </section>`;
  }

  function caseRow(c) {
    return `
    <button data-open="${c.id}" class="card-hover" style="text-align:left;cursor:pointer;background:#15171a;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:clamp(18px,3vw,26px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;align-items:center;">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="font-size:11.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#7e8086;">${esc(c.sector)}</span>
          <span style="font-size:11.5px;color:#8b8d93;">· ${esc(c.year)}</span>
        </div>
        <div style="font-family:'Spectral',serif;font-size:1.4rem;font-weight:600;color:#F0EEE7;letter-spacing:-0.01em;line-height:1.15;margin-bottom:8px;">${esc(c.title)}</div>
        <p style="font-size:13.5px;color:#9b9da3;line-height:1.5;margin:0;max-width:54ch;">${esc(c.blurb)}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <div>
          <div style="font-family:'Spectral',serif;font-weight:700;font-size:1.8rem;color:#F3F1EB;line-height:1;" class="tnum">${esc(fmt(c.value))}</div>
          <div style="font-size:12px;color:#8b8d93;margin-top:4px;">${esc(c.valueLabel)}</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">${statusChips(c.status)}</div>
      </div>
    </button>`;
  }

  function screenCases() {
    return `
    <section style="padding-top:clamp(30px,5vw,52px);">
      <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);margin:0 0 10px;color:#F6F4EE;letter-spacing:-0.02em;">Rastet</h1>
      <p style="color:#a8aab0;font-size:16px;max-width:62ch;margin:0 0 36px;line-height:1.55;">Kontrata publike, gjetje auditimi dhe kosto shtetërore — secila me etiketën e saj të statusit dhe burimet përkatëse.</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${cases.map(caseRow).join("")}
      </div>
    </section>`;
  }

  function screenCase() {
    const cur = cases.find((c) => c.id === state.caseId) || cases[0];
    const facts = cur.facts.map((f) => {
      const chip = statusChips([f.statusKey]);
      return `
      <div style="background:#15171a;padding:clamp(16px,2.6vw,22px);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;align-items:center;">
        <div>
          ${chip}
          <div style="font-size:15px;color:#E6E3DC;font-weight:500;margin-top:10px;line-height:1.4;">${esc(f.label)}</div>
          <div style="font-size:12.5px;color:#7e8086;margin-top:6px;">Burim: ${esc(f.source)}</div>
        </div>
        <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.3rem,3vw,1.7rem);color:#F0EEE7;text-align:right;" class="tnum">${esc(f.value)}</div>
      </div>`;
    }).join("");

    const sources = cur.sources.map((src) => {
      const chip = srcChip(src.kind);
      return `
      <a href="${esc(src.url || '#')}" target="_blank" rel="noopener noreferrer" class="link-row" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:#bdbfc4;font-size:14px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
        <span style="${chip.style}">${esc(chip.kindLabel)}</span>
        <span style="flex:1;">${esc(src.label)}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b8d93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
      </a>`;
    }).join("");

    const catalog = buildCounts(cur.value);
    const catalogCards = catalog.map((b) => `
      <div style="background:#15171a;border:1px solid rgba(74,157,91,0.16);border-radius:16px;padding:20px;">
        <div style="color:#56b06a;margin-bottom:14px;">${iconSvg(b.icon, 22, "currentColor")}</div>
        <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.6rem,3.4vw,2.1rem);color:#8ed29c;line-height:1;" class="tnum">${esc(b.count)}</div>
        <div style="font-size:13.5px;color:#d9d7d0;font-weight:500;margin-top:8px;line-height:1.3;">${esc(b.label)}</div>
        <div style="font-size:11.5px;color:#7e8086;margin-top:5px;">≈ ${esc(b.unitFmt)} ${esc(b.unitSuffix)}</div>
      </div>`).join("");

    const isBuildable = cur.buildable !== false;
    const buildBlock = isBuildable ? `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#56b06a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.4rem,3vw,1.8rem);margin:0;color:#F3F1EB;letter-spacing:-0.01em;">Me këtë shumë mund të ishte ndërtuar</h2>
      </div>
      <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;letter-spacing:0.03em;color:#56b06a;background:rgba(74,157,91,0.13);border:1px solid rgba(74,157,91,0.28);margin-bottom:20px;">Krahasim ilustrues</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px;">
        ${catalogCards}
      </div>` : `
      <div style="background:rgba(86,176,106,0.06);border:1px solid rgba(86,176,106,0.22);border-radius:16px;padding:clamp(18px,3vw,26px);margin-bottom:18px;display:flex;gap:14px;align-items:flex-start;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56b06a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px;"><path d="M20 6 9 17l-5-5"></path></svg>
        <div>
          <div style="font-family:'Spectral',serif;font-weight:700;font-size:1.15rem;color:#F0EEE7;margin-bottom:6px;">Pa krahasim "çfarë mund të ishte ndërtuar"</div>
          <p style="margin:0;font-size:14px;color:#bdbfc4;line-height:1.6;">${esc(cur.valueKind || "Kjo shifër nuk përfaqëson para publike të humbura, prandaj nuk shndërrohet në njësi ndërtimi.")} Shifra mbetet e dokumentuar më sipër me statusin dhe burimin e saj.</p>
        </div>
      </div>`;

    return `
    <section style="padding-top:clamp(24px,4vw,40px);">
      <button data-go="cases" style="display:inline-flex;align-items:center;gap:7px;background:none;border:none;color:#9b9da3;font-family:'Hanken Grotesk';font-size:14px;font-weight:600;cursor:pointer;padding:0;margin-bottom:24px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg> Të gjitha rastet
      </button>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">${statusChips(cur.status)}</div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
        <span style="font-size:12.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#7e8086;">${esc(cur.sector)}</span>
        <span style="font-size:12.5px;color:#8b8d93;">· ${esc(cur.year)}</span>
      </div>
      <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,5vw,3.1rem);margin:0 0 28px;color:#F6F4EE;letter-spacing:-0.02em;line-height:1.02;">${esc(cur.title)}</h1>

      <div style="background:linear-gradient(150deg,rgba(210,59,59,0.1),rgba(210,59,59,0.02));border:1px solid rgba(210,59,59,0.24);border-radius:20px;padding:clamp(24px,4vw,38px);margin-bottom:30px;">
        <div style="font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#d98f8a;margin-bottom:8px;">${esc(cur.valueLabel)}</div>
        <div style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,7.5vw,4.6rem);line-height:0.95;color:#F6F4EE;letter-spacing:-0.025em;" class="tnum">${esc(fmt(cur.value))}</div>
        <p style="font-size:15.5px;color:#bdbfc4;line-height:1.6;margin:20px 0 0;max-width:64ch;">${esc(cur.summary)}</p>
      </div>

      <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.4rem,3vw,1.8rem);margin:0 0 16px;color:#F3F1EB;letter-spacing:-0.01em;">Faktet, sipas burimit</h2>
      <div style="display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;margin-bottom:36px;">
        ${facts}
      </div>

      ${buildBlock}

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:30px;">
        <div style="background:#121316;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:24px;">
          <h3 style="font-family:'Spectral',serif;font-weight:700;font-size:1.2rem;margin:0 0 16px;color:#F0EEE7;">Burimet</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">${sources}</div>
        </div>
        <div style="background:#121316;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:24px;">
          <h3 style="font-family:'Spectral',serif;font-weight:700;font-size:1.2rem;margin:0 0 12px;color:#F0EEE7;">Shënim metodologjik</h3>
          <p style="font-size:14px;color:#9b9da3;line-height:1.6;margin:0 0 16px;">${esc(cur.note)}</p>
          <button data-go="method" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.16);color:#ECEAE3;border-radius:10px;padding:11px 16px;font-family:'Hanken Grotesk';font-size:13.5px;font-weight:600;cursor:pointer;">Lexo metodologjinë e plotë →</button>
        </div>
      </div>
    </section>`;
  }

  function screenCalc() {
    const catalog = buildCounts(state.calc);
    const chips = cases.filter((c) => c.buildable !== false).map((c) =>
      `<button data-setcalc="${c.value}" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.13);color:#cfd1d6;border-radius:100px;padding:8px 14px;font-family:'Hanken Grotesk';font-size:13px;font-weight:600;cursor:pointer;">${esc(c.shortTitle)}</button>`
    ).join("");

    const cards = catalog.map((b) => `
      <div style="background:#15171a;border:1px solid rgba(74,157,91,0.18);border-radius:18px;padding:22px;">
        <div style="color:#56b06a;margin-bottom:14px;">${iconSvg(b.icon, 24, "currentColor")}</div>
        <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.9rem,4.4vw,2.6rem);color:#8ed29c;line-height:1;" class="tnum">${esc(b.count)}</div>
        <div style="font-size:14px;color:#d9d7d0;font-weight:500;margin-top:9px;line-height:1.3;">${esc(b.label)}</div>
        <div style="font-size:11.5px;color:#7e8086;margin-top:6px;">≈ ${esc(b.unitFmt)} ${esc(b.unitSuffix)}</div>
      </div>`).join("");

    return `
    <section style="padding-top:clamp(30px,5vw,52px);">
      <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);margin:0 0 10px;color:#F6F4EE;letter-spacing:-0.02em;">Çfarë do të kishe ndërtuar ti?</h1>
      <p style="color:#a8aab0;font-size:16px;max-width:60ch;margin:0 0 34px;line-height:1.55;">Zhvendos shumën dhe shiko sa njësi reale do të financoheshin. Krahasim ilustrues, bazuar në kosto mesatare projektesh publike të ngjashme.</p>

      <div style="background:linear-gradient(150deg,#191b1e,#121316);border:1px solid rgba(255,255,255,0.09);border-radius:22px;padding:clamp(24px,4vw,40px);margin-bottom:28px;">
        <div id="calcLabel" style="font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#8b8d93;margin-bottom:8px;">Shuma e zgjedhur</div>
        <div id="calcValue" aria-live="polite" style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2.1rem,10vw,6rem);line-height:0.92;color:#F6F4EE;letter-spacing:-0.03em;" class="tnum">${esc(fmt(state.calc))}</div>
        <input id="calcRange" type="range" min="0" max="2000000000" step="1000000" value="${state.calc}" aria-labelledby="calcLabel" aria-valuetext="${esc(fmt(state.calc))}" style="width:100%;margin:26px 0 10px;height:8px;cursor:pointer;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#8b8d93;" class="tnum">
          <span>€0</span><span>€1 mld</span><span>€2 mld</span>
        </div>

        <div style="margin-top:22px;">
          <div style="font-size:12px;color:#7e8086;margin-bottom:10px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;">Kërce te një rast</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">${chips}</div>
        </div>
      </div>

      <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;letter-spacing:0.03em;color:#56b06a;background:rgba(74,157,91,0.13);border:1px solid rgba(74,157,91,0.28);margin-bottom:18px;">Krahasim ilustrues</div>
      <div id="calcCatalog" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:13px;margin-bottom:30px;">
        ${cards}
      </div>

      <div style="background:#121316;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px;display:flex;gap:14px;align-items:flex-start;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b8d93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px;"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
        <p style="margin:0;font-size:13.5px;color:#9b9da3;line-height:1.6;">Kostot për njësi janë vlerësime ilustruese mesatare, jo oferta reale për një projekt specifik. Ato shërbejnë vetëm për t'i dhënë madhësi shumës. Shih <button data-go="method" style="background:none;border:none;color:#8ed29c;font-weight:600;cursor:pointer;padding:0;font-family:inherit;font-size:13.5px;text-decoration:underline;">metodologjinë</button> për burimet e kostove.</p>
      </div>
    </section>`;
  }

  function screenMethod() {
    const legend = Object.values(statusMeta).map((m) => {
      const style = `display:inline-flex;align-items:center;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;white-space:nowrap;flex:none;color:${m.c};background:${m.c}1f;border:1px solid ${m.c}55;`;
      return `
      <div style="display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:12px;background:#15171a;border:1px solid rgba(255,255,255,0.06);">
        <span style="${style}">${esc(m.text)}</span>
        <span style="font-size:14px;color:#a8aab0;line-height:1.5;flex:1;">${esc(m.desc)}</span>
      </div>`;
    }).join("");

    const costRows = catalogMeta.map((m) => {
      const meta = unitMeta[m.key] || {};
      const srcLinks = (meta.sources || []).map((u, i) =>
        `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" style="color:#8ed29c;text-decoration:underline;font-size:11.5px;margin-right:12px;white-space:nowrap;">burim ${i + 1}</a>`).join("");
      const rng = (meta.low != null && meta.high != null)
        ? `<span style="font-size:11.5px;color:#7e8086;margin-right:12px;">interval ${esc(fmt(meta.low))} – ${esc(fmt(meta.high))}</span>` : "";
      return `
      <div style="background:#15171a;padding:16px 18px;display:flex;flex-direction:column;gap:9px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="color:#56b06a;flex:none;">${iconSvg(icons[m.key], 20, "currentColor")}</span>
          <span style="flex:1;font-size:14.5px;color:#d9d7d0;font-weight:500;">${esc(m.label)}</span>
          <span style="font-family:'Spectral',serif;font-weight:700;font-size:1.15rem;color:#F0EEE7;" class="tnum">${esc(fmt(units[m.key]))}</span>
        </div>
        <div style="font-size:12.5px;color:#9b9da3;line-height:1.55;">${esc(meta.basis || "")}</div>
        <div style="display:flex;flex-wrap:wrap;align-items:center;">${rng}${srcLinks}</div>
      </div>`;
    }).join("");

    return `
    <section style="padding-top:clamp(30px,5vw,52px);max-width:780px;">
      <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);margin:0 0 12px;color:#F6F4EE;letter-spacing:-0.02em;">Metodologjia</h1>
      <p style="color:#a8aab0;font-size:16px;line-height:1.6;margin:0 0 36px;">Si i mbledhim, klasifikojmë dhe krahasojmë të dhënat — dhe ku janë kufijtë e këtij ilustrimi.</p>

      <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:1.5rem;margin:0 0 14px;color:#F0EEE7;">Etiketat e statusit</h2>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:36px;">${legend}</div>

      <h2 style="font-family:'Spectral',serif;font-weight:700;font-size:1.5rem;margin:0 0 14px;color:#F0EEE7;">Kostot për njësi — të bazuara në burime</h2>
      <p style="color:#9b9da3;font-size:14.5px;line-height:1.6;margin:0 0 16px;">Vlera mesatare të bazuara në projekte reale publike në Shqipëri (tenderë, FSHZH, ARRSH, programi i rindërtimit pas tërmetit) — me burimet përkatëse të lidhura më poshtë. Përdoren vetëm për t'i dhënë shkallë shumës, jo si ofertë për një projekt specifik. Disa njësi janë shuma të përsëritura (pagë vjetore, pension mujor, bursë vjetore) — shërbejnë vetëm për krahasim shkalle, jo si kosto njëherëshe.</p>
      <div style="display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;margin-bottom:36px;">
        ${costRows}
      </div>

      <div style="background:rgba(210,59,59,0.06);border:1px solid rgba(210,59,59,0.2);border-radius:16px;padding:24px;">
        <h3 style="font-family:'Spectral',serif;font-weight:700;font-size:1.2rem;margin:0 0 12px;color:#e8a8a3;">Kufijtë &amp; parimet</h3>
        <ul style="margin:0;padding-left:20px;color:#bdbfc4;font-size:14.5px;line-height:1.7;">
          <li>Asnjë shumë nuk paraqitet si "e vjedhur" pa vendim gjykate të formës së prerë.</li>
          <li>Dallojmë qartë vlerën e kontratës, paranë publike të paguar, gjetjet e auditimit, akuzat dhe vendimet.</li>
          <li>Krahasimet janë ilustruese — jo një pretendim se paratë do të shkonin patjetër në ato projekte.</li>
          <li>Çdo rast lidhet me burimin e tij; gabimet korrigjohen sapo dokumentohen.</li>
        </ul>
      </div>
    </section>`;
  }

  function screenSources() {
    const cards = sourceTypes.map((st) => {
      const chip = srcChip(st.kind);
      return `
      <div style="background:#15171a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px;">
        <span style="${chip.style}">${esc(chip.kindLabel)}</span>
        <h3 style="font-family:'Spectral',serif;font-weight:600;font-size:1.15rem;margin:14px 0 8px;color:#F0EEE7;">${esc(st.title)}</h3>
        <p style="font-size:13.5px;color:#9b9da3;line-height:1.55;margin:0;">${esc(st.desc)}</p>
      </div>`;
    }).join("");

    return `
    <section style="padding-top:clamp(30px,5vw,52px);max-width:820px;">
      <h1 style="font-family:'Spectral',serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);margin:0 0 12px;color:#F6F4EE;letter-spacing:-0.02em;">Burimet</h1>
      <p style="color:#a8aab0;font-size:16px;line-height:1.6;margin:0 0 34px;">Llojet e burimeve mbi të cilat ndërtohet platforma. Çdo rast i referohet burimit konkret në faqen e tij.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">${cards}</div>
    </section>`;
  }

  // ---------- RENDER ----------

  function screenBody() {
    switch (state.screen) {
      case "home": return screenHome();
      case "cases": return screenCases();
      case "case": return screenCase();
      case "calc": return screenCalc();
      case "method": return screenMethod();
      case "sources": return screenSources();
      default: return screenHome();
    }
  }

  function render() {
    const app = document.getElementById("app");
    updateMeta();
    app.innerHTML = `
      <div style="position:relative;min-height:100vh;background:#0e0e10;color:#ECEAE3;font-family:'Hanken Grotesk',system-ui,sans-serif;overflow-x:hidden;">
        <div style="position:relative;z-index:2;">
          ${header()}
          <main style="max-width:1240px;margin:0 auto;padding:0 clamp(16px,4vw,28px) 80px;">
            ${screenBody()}
          </main>
          ${footer()}
        </div>
      </div>`;

    bindEvents();
  }

  // Update only the calculator value + catalog without full re-render (keeps slider focus/drag smooth)
  function updateCalc(v) {
    state.calc = isNaN(v) ? 0 : v;
    const valEl = document.getElementById("calcValue");
    const catEl = document.getElementById("calcCatalog");
    const rangeEl = document.getElementById("calcRange");
    if (valEl) valEl.textContent = fmt(state.calc);
    if (rangeEl) rangeEl.setAttribute("aria-valuetext", fmt(state.calc));
    if (catEl) {
      const catalog = buildCounts(state.calc);
      catEl.innerHTML = catalog.map((b) => `
        <div style="background:#15171a;border:1px solid rgba(74,157,91,0.18);border-radius:18px;padding:22px;">
          <div style="color:#56b06a;margin-bottom:14px;">${iconSvg(b.icon, 24, "currentColor")}</div>
          <div style="font-family:'Spectral',serif;font-weight:700;font-size:clamp(1.9rem,4.4vw,2.6rem);color:#8ed29c;line-height:1;" class="tnum">${esc(b.count)}</div>
          <div style="font-size:14px;color:#d9d7d0;font-weight:500;margin-top:9px;line-height:1.3;">${esc(b.label)}</div>
          <div style="font-size:11.5px;color:#7e8086;margin-top:6px;">≈ ${esc(b.unitFmt)} ${esc(b.unitSuffix)}</div>
        </div>`).join("");
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); go(el.getAttribute("data-go")); });
    });
    document.querySelectorAll("[data-open]").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); open(el.getAttribute("data-open")); });
    });
    document.querySelectorAll("[data-setcalc]").forEach((el) => {
      el.addEventListener("click", () => {
        const v = Number(el.getAttribute("data-setcalc"));
        const range = document.getElementById("calcRange");
        if (range) range.value = v;
        updateCalc(v);
      });
    });
    const range = document.getElementById("calcRange");
    if (range) range.addEventListener("input", (e) => updateCalc(Number(e.target.value)));
  }

  // hover effects (style-hover equivalents) via delegated mouse events
  document.addEventListener("mouseover", (e) => {
    const fl = e.target.closest(".foot-link");
    if (fl) fl.style.color = "#ECEAE3";
  });
  document.addEventListener("mouseout", (e) => {
    const fl = e.target.closest(".foot-link");
    if (fl) fl.style.color = "#9b9da3";
  });

  applyUrl();
  render();
  window.addEventListener("popstate", () => { applyUrl(); render(); scrollTop(); });
})();
