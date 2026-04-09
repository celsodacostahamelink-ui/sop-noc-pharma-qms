"use client";
import { useState, useCallback } from "react";

// ============================================================
// NOC PHARMA GmbH  -  QMS v4.0
// 305 Documents · Full Register · Original Version Archive
// EU GMP · BtMG · MedCanG · Annex 11 · 21 CFR Part 11
// ============================================================

// ── COMPLETE 305-DOCUMENT REGISTER ──────────────────────────
const ALL_SOPS = [
  // ── CHAPTER B  -  GENERAL ──
  { id:"SOP",        title:"Umgang mit Qualitaetsproblemen Cannabis API",  series:"legacy", progress:38 },
  { id:"B.1",        title:"Organigramm",                                  series:"legacy", progress:0 },
  { id:"SOP-RRM",    title:"Verwaltung Rueckstell-/Referenzmuster Cannabis",series:"legacy", progress:0 },
  { id:"SOP-100_A6", title:"Ablaufdiagramm Q-Prozesse Dokumente",          series:"legacy", progress:12, updates:4, aiReady:true },
  { id:"SOP-101-02", title:"Ueberpruefung Chargendokumentation",              series:"legacy", progress:0 },
  { id:"SOP-605",    title:"Vernichtung Ausgangsstoffe AM",                 series:"legacy", progress:0 },
  { id:"SOP-605_A1", title:"Anhang zu SOP-605",                            series:"legacy", progress:0 },
  { id:"SOP-605_A2", title:"Anhang zu SOP-605",                            series:"legacy", progress:0 },
  { id:"SOP-605_A3", title:"Anhang zu SOP-605",                            series:"legacy", progress:0 },
  { id:"SOP-605_A4", title:"Anhang zu SOP-605",                            series:"legacy", progress:0 },
  { id:"A1_QMS",     title:"QMS-Inhaltsverzeichnis",                       series:"legacy", progress:50 },
  { id:"B.1_A1",     title:"Anhang zu B.1",                                series:"legacy", progress:0 },
  { id:"4.1.1_B.2.1",title:"Sachkundige Person (QP)",                      series:"legacy", progress:6 },
  { id:"4.1.2_B.2.3",title:"Leiter QS",                                    series:"legacy", progress:0 },
  { id:"B.2.4",      title:"VP Stellenbeschreibung",                        series:"legacy", progress:12 },
  { id:"B.3_A4-01",  title:"Site Master File",                              series:"legacy", progress:44 },
  { id:"B.3_A4",     title:"Site Master File Anhang",                       series:"legacy", progress:0 },
  { id:"VP-52a",     title:"Bestellung VP §52a AMG",                        series:"legacy", progress:6 },
  { id:"PROT-Stern", title:"Bestellungseingangsprotokoll Stern",            series:"legacy", progress:25 },
  { id:"QMS",        title:"QMS-Inhaltsverzeichnis",                        series:"legacy", progress:0 },

  // ── CHAPTER 1  -  QUALITY MANAGEMENT (SOP-100 series) ──
  { id:"SOP-100_01",   title:"Qualitaetsmanagement",              series:"legacy", progress:25, updates:4 },
  { id:"SOP-100_A1",   title:"Aenderungshistorie",                series:"legacy", progress:0,  updates:4 },
  { id:"SOP-100_A2-01",title:"Verteiler/Schulungsnachweis",      series:"legacy", progress:25, updates:4 },
  { id:"SOP-100_A6b",  title:"Ablaufdiagramm QKK",              series:"legacy", progress:0 },
  { id:"SOP-100_A7",   title:"Ablaufdiagramm QKK",              series:"legacy", progress:25, updates:4 },
  { id:"SOP-101_A1-02",title:"Anhang SOP-101",                  series:"legacy", progress:0 },
  { id:"SOP-101_A2-02",title:"Anhang SOP-101",                  series:"legacy", progress:0 },
  { id:"SOP-101_A3",   title:"Anhang SOP-101",                  series:"legacy", progress:0 },
  { id:"SOP-101_A4-02",title:"Anhang SOP-101",                  series:"legacy", progress:0 },
  { id:"SOP-101_A5-01",title:"Anhang SOP-101",                  series:"legacy", progress:0 },
  { id:"SOP-102_02",   title:"Lieferantenqualifizierung",        series:"legacy", progress:19, updates:1 },
  { id:"SOP-102_A1",   title:"Anhang SOP-102",                  series:"legacy", progress:0,  updates:1 },
  { id:"SOP-102_A2",   title:"Verteiler/Schulungsnachweis",      series:"legacy", progress:19, updates:1 },
  { id:"SOP-102_A3",   title:"Ablaufdiagramm",                  series:"legacy", progress:25, updates:1 },
  { id:"SOP-102_A4",   title:"Lieferantenbewertung",            series:"legacy", progress:31, updates:1 },
  { id:"SOP-102_A5-01",title:"GMP-Fragebogen Selbstauskunft",   series:"legacy", progress:12, updates:1 },
  { id:"SOP-102_A5",   title:"GMP Supplier Assessment",         series:"legacy", progress:0 },
  { id:"SOP-103_01",   title:"Qualitaetsrisikomanagement",       series:"legacy", progress:12, updates:2, overdue:true, overdueDays:808 },
  { id:"SOP-103_A1",   title:"Anhang SOP-103",                  series:"legacy", progress:0,  updates:2 },
  { id:"SOP-103_A2",   title:"Anhang SOP-103",                  series:"legacy", progress:25, updates:2 },
  { id:"SOP-103_A3",   title:"Anhang SOP-103",                  series:"legacy", progress:12, updates:2 },
  { id:"SOP-103_A4",   title:"Anhang SOP-103",                  series:"legacy", progress:12, updates:2 },
  { id:"SOP-103_A5",   title:"Anhang SOP-103",                  series:"legacy", progress:19, updates:2 },
  { id:"SOP-104_01",   title:"Abweichungen",                    series:"legacy", progress:31, overdue:true, overdueDays:808 },
  { id:"SOP-104_A1",   title:"Anhang SOP-104",                  series:"legacy", progress:0 },
  { id:"SOP-104_A2",   title:"Anhang SOP-104",                  series:"legacy", progress:19 },
  { id:"SOP-104_A3",   title:"Anhang SOP-104",                  series:"legacy", progress:12 },
  { id:"SOP-104_A4",   title:"Anhang SOP-104",                  series:"legacy", progress:25 },
  { id:"SOP-104_A5",   title:"Anhang SOP-104",                  series:"legacy", progress:19 },
  { id:"SOP-105_01",   title:"CAPA",                            series:"legacy", progress:25 },
  { id:"SOP-105_A1",   title:"Anhang SOP-105",                  series:"legacy", progress:0 },
  { id:"SOP-105_A2",   title:"Anhang SOP-105",                  series:"legacy", progress:19 },
  { id:"SOP-105_A3",   title:"Anhang SOP-105",                  series:"legacy", progress:19 },
  { id:"SOP-105_A4",   title:"Anhang SOP-105",                  series:"legacy", progress:25 },
  { id:"SOP-105_A5",   title:"Anhang SOP-105",                  series:"legacy", progress:31 },
  { id:"SOP-105_A6",   title:"Anhang SOP-105",                  series:"legacy", progress:25 },
  { id:"SOP-106_01",   title:"Audits/Selbstinspektionen",       series:"legacy", progress:19 },
  { id:"SOP-106_A1",   title:"Anhang SOP-106",                  series:"legacy", progress:0 },
  { id:"SOP-106_A2-01",title:"Anhang SOP-106",                  series:"legacy", progress:25 },
  { id:"SOP-106_A3-01",title:"Anhang SOP-106",                  series:"legacy", progress:6 },
  { id:"SOP-106_A4-01",title:"Anhang SOP-106",                  series:"legacy", progress:31 },
  { id:"SOP-106_A5",   title:"Anhang SOP-106",                  series:"legacy", progress:0 },
  { id:"SOP-106_A6-01",title:"Anhang SOP-106",                  series:"legacy", progress:38 },
  { id:"SOP-109_01",   title:"Beanstandungen",                  series:"legacy", progress:19 },
  { id:"SOP-109_A1",   title:"Anhang SOP-109",                  series:"legacy", progress:0 },
  { id:"SOP-109_A2",   title:"Anhang SOP-109",                  series:"legacy", progress:25 },
  { id:"SOP-109_A3-01",title:"Anhang SOP-109",                  series:"legacy", progress:6 },
  { id:"SOP-109_A4-01",title:"Anhang SOP-109",                  series:"legacy", progress:0 },
  { id:"SOP-109_A5-01",title:"Anhang SOP-109",                  series:"legacy", progress:6 },
  { id:"SOP-109_A6",   title:"Anhang SOP-109",                  series:"legacy", progress:6 },
  { id:"SOP-110_01",   title:"Produktrueckruf",                  series:"legacy", progress:19, updates:1 },
  { id:"SOP-110_A1",   title:"Anhang SOP-110",                  series:"legacy", progress:0,  updates:1 },
  { id:"SOP-110_A2",   title:"Anhang SOP-110",                  series:"legacy", progress:31, updates:1 },
  { id:"SOP-110_A3-01",title:"Anhang SOP-110",                  series:"legacy", progress:25, updates:1 },
  { id:"SOP-110_A4-01",title:"Anhang SOP-110",                  series:"legacy", progress:25, updates:1 },
  { id:"SOP-110_A5-01",title:"Anhang SOP-110",                  series:"legacy", progress:6,  updates:1 },
  { id:"SOP-130",      title:"Umgang mit Faelschungen",          series:"legacy", progress:6,  overdue:true, overdueDays:810 },
  { id:"SOP-130_A1",   title:"Anhang SOP-130",                  series:"legacy", progress:0 },
  { id:"SOP-130_A2",   title:"Anhang SOP-130",                  series:"legacy", progress:19 },
  { id:"SOP-130_A3",   title:"Anhang SOP-130",                  series:"legacy", progress:19 },
  { id:"SOP-130_A4",   title:"Anhang SOP-130",                  series:"legacy", progress:0 },
  { id:"SOP-130_A5",   title:"Anhang SOP-130",                  series:"legacy", progress:6 },

  // ── CHAPTER 2  -  OOS/ANALYTICAL ──
  { id:"SOP-202_A1-OOX",title:"SOP 202 Ergebnisse",  series:"legacy", progress:0 },
  { id:"SOP-202_A1-Rev", title:"SOP 202 Rev",         series:"legacy", progress:0 },
  { id:"SOP-202_A2-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A3-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A4-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A5-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A6-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A7-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A8-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A9-01",  title:"Anhang SOP 202",      series:"legacy", progress:0 },
  { id:"SOP-202_A10-01", title:"Anhang SOP 202",      series:"legacy", progress:0 },

  // ── CHAPTER 3  -  PERSONNEL ──
  { id:"SOP-301_01",    title:"Qualifizierung Mitarbeiter", series:"legacy", progress:19, updates:1 },
  { id:"SOP-301_A1-01", title:"Anhang SOP-301",            series:"legacy", progress:0,  updates:1 },
  { id:"SOP-301_A2-01", title:"Anhang SOP-301",            series:"legacy", progress:19, updates:1 },
  { id:"SOP-301_A3",    title:"Anhang SOP-301",            series:"legacy", progress:0,  updates:1 },
  { id:"SOP-301_A4",    title:"Anhang SOP-301",            series:"legacy", progress:6,  updates:1 },
  { id:"SOP-301_A5",    title:"Anhang SOP-301",            series:"legacy", progress:6,  updates:1 },
  { id:"SOP-301_A6_01", title:"Anhang SOP-301",            series:"legacy", progress:38, updates:1 },
  { id:"SOP-302",       title:"Gesundheitsueberwachung",    series:"legacy", progress:25 },
  { id:"SOP-302h",      title:"Personalhygiene",           series:"legacy", progress:0 },
  { id:"SOP-302_A1",    title:"Anhang SOP-302",            series:"legacy", progress:0 },
  { id:"SOP-302_A2",    title:"Anhang SOP-302",            series:"legacy", progress:19 },
  { id:"SOP-302_A3",    title:"Anhang SOP-302",            series:"legacy", progress:6 },
  { id:"SOP-302_A4",    title:"Anhang SOP-302",            series:"legacy", progress:6 },
  { id:"SOP-302_A5",    title:"Anhang SOP-302",            series:"legacy", progress:0 },
  { id:"SOP-303",       title:"Personalhygiene",           series:"legacy", progress:25 },

  // ── CHAPTER 4  -  DOCUMENTATION ──
  { id:"SOP-401",      title:"Erstellen/Verteilen/Aktualisieren SOPs", series:"legacy", progress:25, updates:1 },
  { id:"SOP-401_A1",   title:"Anhang SOP-401",                        series:"legacy", progress:0,  updates:1 },
  { id:"SOP-401_A2",   title:"Anhang SOP-401",                        series:"legacy", progress:19, updates:1 },
  { id:"SOP-401_A3",   title:"Anhang SOP-401",                        series:"legacy", progress:6,  updates:1 },
  { id:"SOP-402",      title:"Unterschriften/Berechtigung",           series:"legacy", progress:19, updates:1 },
  { id:"SOP-402_A1",   title:"Anhang SOP-402",                        series:"legacy", progress:0,  updates:1 },
  { id:"SOP-402_A2",   title:"Anhang SOP-402",                        series:"legacy", progress:19, updates:1 },
  { id:"SOP-403",      title:"Protokollfuehrung/Logbuecher",            series:"legacy", progress:25, updates:3 },
  { id:"SOP-403_A1",   title:"Anhang SOP-403",                        series:"legacy", progress:0,  updates:3 },
  { id:"SOP-403_A2",   title:"Anhang SOP-403",                        series:"legacy", progress:19, updates:3 },
  { id:"SOP-403_A3",   title:"Anhang SOP-403",                        series:"legacy", progress:6,  updates:3 },
  { id:"SOP-404",      title:"Archivierung",                          series:"legacy", progress:44, updates:2 },
  { id:"SOP-404_A1",   title:"Anhang SOP-404",                        series:"legacy", progress:0,  updates:2 },
  { id:"SOP-404_A2",   title:"Anhang SOP-404",                        series:"legacy", progress:19, updates:2 },
  { id:"SOP-404_A3",   title:"Anhang SOP-404",                        series:"legacy", progress:38, updates:1 },
  { id:"SOP-404_A4",   title:"Anhang SOP-404",                        series:"legacy", progress:25, updates:2 },
  { id:"SOP-404_A5",   title:"Anhang SOP-404",                        series:"legacy", progress:0,  updates:2 },
  { id:"SOP-404_A6",   title:"Anhang SOP-404",                        series:"legacy", progress:6,  updates:2 },
  { id:"SOP-407_01",   title:"Herstellungs-/Verpackungsanweisung",    series:"legacy", progress:0 },
  { id:"SOP-407_A3-01",title:"Ablaufdiagramm",                        series:"legacy", progress:0 },
  { id:"SOP-407_A4-01",title:"Anforderung Herstellungsanweisung",     series:"legacy", progress:0 },
  { id:"SOP-407_A5-01",title:"Vorlage Herstellungsanweisung",         series:"legacy", progress:0 },
  { id:"SOP-407_A6-01",title:"Vorlage Herstellungsanweisung",         series:"legacy", progress:0 },

  // ── CHAPTER 5  -  BUILDINGS & EQUIPMENT ──
  { id:"SOP-500_A1",  title:"Anhang SOP-500",               series:"legacy", progress:0 },
  { id:"SOP-500_A2",  title:"Anhang SOP-500",               series:"legacy", progress:19 },
  { id:"SOP-500",     title:"Hygieneplan",                  series:"legacy", progress:19 },
  { id:"SOP-501",     title:"Qualifizierung Anlagen/Geraete",series:"legacy", progress:19, updates:1 },
  { id:"SOP-501_A1",  title:"Anhang SOP-501",               series:"legacy", progress:0,  updates:1 },
  { id:"SOP-501_A2",  title:"Anhang SOP-501",               series:"legacy", progress:19, updates:1 },
  { id:"SOP-501_A3",  title:"Anhang SOP-501",               series:"legacy", progress:31, updates:1 },
  { id:"SOP-501_A4",  title:"Anhang SOP-501",               series:"legacy", progress:12, updates:1 },
  { id:"SOP-501_A6",  title:"Anhang SOP-501",               series:"legacy", progress:12, updates:1 },
  { id:"SOP-501_A7",  title:"Anhang SOP-501",               series:"legacy", progress:6,  updates:1 },
  { id:"SOP-501_A8",  title:"Anhang SOP-501",               series:"legacy", progress:19, updates:1 },
  { id:"SOP-502",     title:"Schaedlingsueberwachung",        series:"legacy", progress:12 },
  { id:"SOP-502_A1",  title:"Anhang SOP-502",               series:"legacy", progress:0 },
  { id:"SOP-502_A2",  title:"Anhang SOP-502",               series:"legacy", progress:19 },
  { id:"SOP-502_A3",  title:"Anhang SOP-502",               series:"legacy", progress:12 },
  { id:"SOP-503",     title:"Reinigung",                    series:"legacy", progress:19 },
  { id:"SOP-503_A1",  title:"Anhang SOP-503",               series:"legacy", progress:0 },
  { id:"SOP-503_A2",  title:"Anhang SOP-503",               series:"legacy", progress:19 },
  { id:"SOP-503_A3",  title:"Anhang SOP-503",               series:"legacy", progress:6 },
  { id:"SOP-503_A4",  title:"Anhang SOP-503",               series:"legacy", progress:12 },
  { id:"SOP-503_A5",  title:"Anhang SOP-503",               series:"legacy", progress:6 },
  { id:"SOP-504",     title:"Zonenkonzept/Zutritt",         series:"legacy", progress:19 },
  { id:"SOP-504_A1",  title:"Anhang SOP-504",               series:"legacy", progress:0 },
  { id:"SOP-504_A2",  title:"Anhang SOP-504",               series:"legacy", progress:19 },
  { id:"SOP-504_A3",  title:"Anhang SOP-504",               series:"legacy", progress:6 },
  { id:"SOP-504_A4",  title:"Anhang SOP-504",               series:"legacy", progress:12 },
  { id:"SOP-513",     title:"Umgebungskontrolle",           series:"legacy", progress:19 },
  { id:"SOP-513_A1",  title:"Anhang SOP-513",               series:"legacy", progress:0 },
  { id:"SOP-513_A2",  title:"Anhang SOP-513",               series:"legacy", progress:19 },
  { id:"SOP-513_A3",  title:"Anhang SOP-513",               series:"legacy", progress:12 },
  { id:"SOP-513_A4",  title:"Anhang SOP-513",               series:"legacy", progress:6 },
  { id:"SOP-525",     title:"Temperaturueberwachung",        series:"legacy", progress:12 },
  { id:"SOP-525_A1",  title:"Anhang SOP-525",               series:"legacy", progress:0 },
  { id:"SOP-525_A2",  title:"Anhang SOP-525",               series:"legacy", progress:6 },
  { id:"SOP-525_A3",  title:"Klima Monitoring",             series:"legacy", progress:25 },

  // ── CHAPTER 6  -  MATERIAL / BtM ──
  { id:"SOP-600",      title:"Validierungsmasterplan",         series:"legacy", progress:12, updates:3 },
  { id:"SOP-600_A1",   title:"Anhang SOP-600",                series:"legacy", progress:0,  updates:3 },
  { id:"SOP-600_A2",   title:"Anhang SOP-600",                series:"legacy", progress:25, updates:3 },
  { id:"SOP-600_A3",   title:"Anhang SOP-600",                series:"legacy", progress:19, updates:3 },
  { id:"SOP-600_A4",   title:"Anhang SOP-600",                series:"legacy", progress:6,  updates:3 },
  { id:"SOP-600_A5",   title:"Anhang SOP-600",                series:"legacy", progress:12, updates:3 },
  { id:"SOP-600_A6",   title:"Anhang SOP-600",                series:"legacy", progress:6,  updates:3 },
  { id:"SOP-600_A7",   title:"Anhang SOP-600",                series:"legacy", progress:19, updates:3 },
  { id:"SOP-602_01",   title:"Anhang SOP-602",                series:"legacy", progress:0 },
  { id:"SOP-604_A1",   title:"Anhang SOP-604",                series:"legacy", progress:0,  updates:4 },
  { id:"SOP-604_A2",   title:"Anhang SOP-604",                series:"legacy", progress:19, updates:4 },
  { id:"SOP-604_A3",   title:"Anhang SOP-604",                series:"legacy", progress:19, updates:4 },
  { id:"SOP-604_A4",   title:"Anhang SOP-604",                series:"legacy", progress:19, updates:4 },
  { id:"SOP-604_A5",   title:"Anhang SOP-604",                series:"legacy", progress:25, updates:4 },
  { id:"SOP-604_A6",   title:"Anhang SOP-604",                series:"legacy", progress:25, updates:4 },
  { id:"SOP-604_A7",   title:"BtM-Bestandsaufnahme",          series:"legacy", progress:0,  isBtm:true },
  { id:"SOP-604-02",   title:"Wareneingang/Kontrollen",       series:"legacy", progress:25, updates:4 },
  { id:"SOP-605_A3p",  title:"Anhang SOP-605",                series:"legacy", progress:0 },
  { id:"SOP-605-A4",   title:"Vernichtungsprotokoll",         series:"legacy", progress:0 },
  { id:"SOP-640_01",   title:"Beschaffung Wirk-/Hilfsstoffe", series:"legacy", progress:0 },
  { id:"SOP-640_A1",   title:"Anhang SOP-640",                series:"legacy", progress:0 },
  { id:"SOP-640_A2",   title:"Anhang SOP-640",                series:"legacy", progress:0 },
  { id:"SOP-640_A3",   title:"Anhang SOP-640",                series:"legacy", progress:0 },

  // ── CHAPTER 7  -  TRANSPORT / GDP ──
  { id:"SOP-700",       title:"GDP-Masterplan",                      series:"legacy", progress:25, updates:1 },
  { id:"SOP-700_A1",    title:"Anhang SOP-700",                      series:"legacy", progress:0,  updates:1 },
  { id:"SOP-700_A2",    title:"Anhang SOP-700",                      series:"legacy", progress:19, updates:1 },
  { id:"SOP-700_A3-01", title:"Anhang SOP-700",                      series:"legacy", progress:25, updates:1 },
  { id:"SOP-702",       title:"Qualifizierung Transportunternehmen", series:"legacy", progress:25 },
  { id:"SOP-702_A1",    title:"Anhang SOP-702",                      series:"legacy", progress:0 },
  { id:"SOP-702_A2",    title:"Anhang SOP-702",                      series:"legacy", progress:25 },
  { id:"SOP-703",       title:"Qualifizierung Transportverpackungen",series:"legacy", progress:25 },
  { id:"SOP-703_A1",    title:"Anhang SOP-703",                      series:"legacy", progress:0 },
  { id:"SOP-703_A2",    title:"Anhang SOP-703",                      series:"legacy", progress:25 },
  { id:"SOP-703_A3",    title:"Anhang SOP-703",                      series:"legacy", progress:31 },
  { id:"SOP-703_A4",    title:"Anhang SOP-703",                      series:"legacy", progress:6 },
  { id:"SOP-703_A5",    title:"Anhang SOP-703",                      series:"legacy", progress:6 },
  { id:"SOP-703_A6",    title:"Anhang SOP-703",                      series:"legacy", progress:19 },
  { id:"SOP-706",       title:"Qualifikation (Neu-)Kunden",          series:"legacy", progress:25, updates:2 },
  { id:"SOP-706_A1",    title:"Anhang SOP-706",                      series:"legacy", progress:6,  updates:2 },
  { id:"SOP-710_A3-01", title:"Bestellungseingangsprotokoll",        series:"legacy", progress:25, updates:4 },
  { id:"SOP-710_01",    title:"Bearbeitung Kundenbestellungen",      series:"legacy", progress:25, updates:4 },
  { id:"SOP-710_02_A1", title:"Interne Transfer",                    series:"legacy", progress:0 },
  { id:"SOP-770",       title:"Transport AM",                        series:"legacy", progress:19 },
  { id:"SOP-770_A1",    title:"Anhang SOP-770",                      series:"legacy", progress:0 },
  { id:"SOP-770_A2",    title:"Anhang SOP-770",                      series:"legacy", progress:19 },
  { id:"SOP-780",       title:"Transportvalidierung",                series:"legacy", progress:19 },
  { id:"SOP-780_A1-01", title:"Anhang SOP-780",                      series:"legacy", progress:0 },
  { id:"SOP-780_A2_01", title:"Anhang SOP-780",                      series:"legacy", progress:6 },
  { id:"SOP-780_A3",    title:"Anhang SOP-780",                      series:"legacy", progress:12 },

  // ── AI SOPs ──
  { id:"SOP-AI-01",    title:"Automated QC & Human Override",  series:"AI", progress:0 },
  { id:"SOP-AI-02",    title:"HITL Digital Signature",         series:"AI", progress:0 },
  { id:"SOP-AI-03",    title:"AI Bias & Data Governance",      series:"AI", progress:0 },
  { id:"SOP-AI-04",    title:"AI Transparency",                series:"AI", progress:0 },
  { id:"SOP-AI-05",    title:"High-Risk AI Lifecycle",         series:"AI", progress:0 },
  { id:"SOP-AI-06",    title:"Monthly Model Review",           series:"AI", progress:0 },
  { id:"SOP-AI-07",    title:"Digital Recall",                 series:"AI", progress:0 },
  { id:"SOP-IT-04",    title:"BfArM Digital Interface",        series:"AI", progress:0 },
  { id:"SOP-V-09",     title:"Pharmacy License Check",         series:"AI", progress:0 },
  { id:"SOP-WH-02",    title:"Inventory AI",                   series:"AI", progress:0 },
  { id:"SOP-AI-08",    title:"CE Marking",                     series:"AI", progress:0 },
  { id:"SOP-AI-09",    title:"AI Inventory AnnexIII",          series:"AI", progress:0 },
  { id:"SOP-AI-10",    title:"AI Log 10yr Retention",          series:"AI", progress:0 },
  { id:"SOP-Distro-01",title:"Wholesale-Only Routing",         series:"AI", progress:0 },
  { id:"SOP-AI-11",    title:"COA Hallucination Check",        series:"AI", progress:0 },

  // ── QMS SERIES ──
  { id:"SOP-QMS-001", title:"Pharmazeutisches Qualitaetssystem", series:"QMS", progress:38, updates:4 },
  { id:"SOP-QMS-002", title:"Dokumentenlenkung",                series:"QMS", progress:31, updates:3 },
  { id:"SOP-QMS-003", title:"Abweichungsmanagement",            series:"QMS", progress:25, updates:2 },
  { id:"SOP-QMS-004", title:"CAPA-Verfahren",                   series:"QMS", progress:25, updates:2 },
  { id:"SOP-QMS-005", title:"Aenderungskontrolle",               series:"QMS", progress:31, updates:3 },
  { id:"SOP-QMS-006", title:"Interne Audits / Selbstinspektion",series:"QMS", progress:19, updates:2 },
  { id:"SOP-QMS-007", title:"Management Review",                series:"QMS", progress:19, updates:2 },
  { id:"SOP-QMS-008", title:"Reklamationsbearbeitung",          series:"QMS", progress:25, updates:2 },
  { id:"SOP-QMS-009", title:"Rueckrufverfahren",                 series:"QMS", progress:31, updates:2 },
  { id:"SOP-QMS-010", title:"Lieferantenqualifizierung",        series:"QMS", progress:25, updates:2 },
  { id:"SOP-QMS-011", title:"Vertragsherstellung / -pruefung",  series:"QMS", progress:19, updates:1 },
  { id:"SOP-QMS-012", title:"Risikomanagement",                 series:"QMS", progress:25, updates:2 },

  // ── PER SERIES ──
  { id:"SOP-PER-001", title:"Personalqualifikation & Schulung", series:"PER", progress:25, updates:2 },
  { id:"SOP-PER-002", title:"Sachkundige Person (QP)",          series:"PER", progress:19, updates:3 },
  { id:"SOP-PER-003", title:"Herstellungsleitung",              series:"PER", progress:19, updates:2 },
  { id:"SOP-PER-004", title:"Kontrollleitung",                  series:"PER", progress:19, updates:2 },
  { id:"SOP-PER-005", title:"Hygiene Personal",                 series:"PER", progress:12, updates:1 },
  { id:"SOP-PER-006", title:"Gesundheitsuntersuchungen",        series:"PER", progress:12, updates:1 },

  // ── MFG SERIES ──
  { id:"SOP-MFG-001", title:"Herstellungsanweisung Allgemein",       series:"MFG", progress:38, updates:4 },
  { id:"SOP-MFG-002", title:"Wareneingang & Probenahme",             series:"MFG", progress:31, updates:4 },
  { id:"SOP-MFG-003", title:"Primaerverpackung",                      series:"MFG", progress:19, updates:2 },
  { id:"SOP-MFG-004", title:"Sekundaerverpackung & Kennzeichnung",    series:"MFG", progress:25, updates:3 },
  { id:"SOP-MFG-005", title:"Chargenfreigabe",                       series:"MFG", progress:38, updates:3 },
  { id:"SOP-MFG-006", title:"Einfuhrverfahren Arzneimittel",         series:"MFG", progress:38, updates:3 },
  { id:"SOP-MFG-007", title:"Inprozesskontrollen (IPC)",             series:"MFG", progress:19, updates:2 },
  { id:"SOP-MFG-008", title:"Reinigungsvalidierung",                 series:"MFG", progress:19, updates:2 },
  { id:"SOP-MFG-009", title:"Prozessvalidierung",                    series:"MFG", progress:25, updates:3 },
  { id:"SOP-MFG-010", title:"Umgebungsmonitoring",                   series:"MFG", progress:19, updates:2 },

  // ── DOC SERIES ──
  { id:"SOP-DOC-001", title:"Chargendokumentation",         series:"DOC", progress:31, updates:3 },
  { id:"SOP-DOC-002", title:"Archivierung & Aufbewahrung",  series:"DOC", progress:31, updates:2 },
  { id:"SOP-DOC-003", title:"Elektronische Aufzeichnungen", series:"DOC", progress:38, updates:3 },
  { id:"SOP-DOC-004", title:"Elektronische Signaturen",     series:"DOC", progress:38, updates:1 },
  { id:"SOP-DOC-005", title:"Site Master File Pflege",      series:"DOC", progress:19, updates:1 },

  // ── GDP SERIES ──
  { id:"SOP-GDP-001", title:"Lagerhaltung & Lagerbedingungen",  series:"GDP", progress:25, updates:2 },
  { id:"SOP-GDP-002", title:"Temperaturmonitoring & -kartierung",series:"GDP", progress:25, updates:2 },
  { id:"SOP-GDP-003", title:"Transport & Distribution",         series:"GDP", progress:25, updates:2 },
  { id:"SOP-GDP-004", title:"Qualifizierung Transportwege",     series:"GDP", progress:19, updates:1 },
  { id:"SOP-GDP-005", title:"Retouren & Faelschungsverdacht",    series:"GDP", progress:19, updates:2 },

  // ── BTM SERIES ──
  { id:"SOP-BTM-001", title:"BtM-Verkehr & Dokumentation",      series:"BTM", progress:38, updates:3 },
  { id:"SOP-BTM-002", title:"BtM-Einfuhr & Ausfuhr",            series:"BTM", progress:38, updates:3 },
  { id:"SOP-BTM-003", title:"BtM-Bestandsfuehrung",              series:"BTM", progress:31, updates:2 },
  { id:"SOP-BTM-004", title:"Vernichtung von Betaeubungsmitteln", series:"BTM", progress:19, updates:1 },
  { id:"SOP-BTM-005", title:"Sicherheitsmassnahmen BtM-Lager",   series:"BTM", progress:25, updates:1 },
  { id:"SOP-BTM-006", title:"Cannabis-spezifische Herstellung",  series:"BTM", progress:38, updates:4 },
  { id:"SOP-BTM-007", title:"Cannabisblueten Verarbeitung",       series:"BTM", progress:31, updates:3 },
  { id:"SOP-BTM-008", title:"Cannabis Extrakt Herstellung",      series:"BTM", progress:31, updates:3 },

  // ── CS SERIES ──
  { id:"SOP-CS-001", title:"Computerized Systems Validation",    series:"CS", progress:44, updates:4 },
  { id:"SOP-CS-002", title:"Zugangssteuerung & Benutzer",        series:"CS", progress:31, updates:2 },
  { id:"SOP-CS-003", title:"Datensicherung & -wiederherstellung",series:"CS", progress:25, updates:2 },
  { id:"SOP-CS-004", title:"Audit Trail Verfahren",              series:"CS", progress:38, updates:2 },
  { id:"SOP-CS-005", title:"KI-System Risikobewertung",          series:"CS", progress:31, updates:2 },
  { id:"SOP-CS-006", title:"KI-System Governance",               series:"CS", progress:25, updates:2 },
  { id:"SOP-CS-007", title:"KI-Datenqualitaetsmanagement",        series:"CS", progress:25, updates:1 },
  { id:"SOP-CS-008", title:"KI-Transparenz & Dokumentation",     series:"CS", progress:25, updates:1 },
  { id:"SOP-CS-009", title:"KI-Menschliche Aufsicht",            series:"CS", progress:25, updates:1 },

  // ── QC SERIES ──
  { id:"SOP-QC-001", title:"Pruefanweisungen Allgemein",              series:"QC", progress:25, updates:2 },
  { id:"SOP-QC-002", title:"Stabilitaetspruefungen",                   series:"QC", progress:19, updates:1 },
  { id:"SOP-QC-003", title:"Referenzstandards & Rueckstellmuster",    series:"QC", progress:19, updates:1 },
  { id:"SOP-QC-004", title:"OOS / OOT Untersuchungen",               series:"QC", progress:31, updates:2 },
  { id:"SOP-QC-005", title:"Pruefmethodenvalidierung",                series:"QC", progress:19, updates:1 },
  { id:"SOP-QC-006", title:"Cannabis Identitaets- & Gehaltspruefung",  series:"QC", progress:38, updates:3 },

  // ── EQ SERIES ──
  { id:"SOP-EQ-001", title:"Qualifizierung Raeume & Ausruestung",       series:"EQ", progress:25, updates:2 },
  { id:"SOP-EQ-002", title:"Kalibrierung Messmittel",                 series:"EQ", progress:19, updates:1 },
  { id:"SOP-EQ-003", title:"Wartung & Instandhaltung",                series:"EQ", progress:19, updates:1 },
  { id:"SOP-EQ-004", title:"Reinheitszonenkonzept",                   series:"EQ", progress:19, updates:1 },
  { id:"SOP-EQ-005", title:"Wasseraufbereitung pharma. Qualitaet",     series:"EQ", progress:19, updates:1 },

  // ── ANLAGEN / SMF ──
  { id:"Anlage-3",  title:"Reinheitszonenplan",           series:"SMF", progress:0, aiReady:true },
  { id:"Anlage-4",  title:"Fliessdiagramme",               series:"SMF", progress:0 },
  { id:"Anlage-5",  title:"SOP-Liste",                    series:"SMF", progress:0 },
  { id:"Anlage-6",  title:"Ausruestungsliste",             series:"SMF", progress:0 },
  { id:"Anlage-7",  title:"QP-Bestaetigung",               series:"SMF", progress:0 },
  { id:"Anlage-8",  title:"Lieferantenuebersicht",         series:"SMF", progress:0 },
  { id:"SMF-V2",    title:"Site Master File V2 (Kahla)",  series:"SMF", progress:0 },
  { id:"SMF-V2-CT", title:"SMF V2 Change Tracking",       series:"SMF", progress:0 },
  { id:"SOP-Matrix",title:"NOC Pharma SOP Matrix",        series:"SMF", progress:0 },
];

// ── ORIGINAL VERSION CONTENT (preview for each uploaded doc) ──
const ORIGINAL_VERSIONS = {
  "SOP-100_A6": {
    filename: "SOP-100_A6-01_Ablaufdiagramm Q-Prozesse Dokumente.pdf",
    version: "v1.0", date: "10.06.2025", pages: 3,
    preview: `SOP-100_A6  -  Ablaufdiagramm Q-Prozesse Dokumente\nVersion 1.0 | Gueltig ab: 10.06.2025\nNOC Pharma GmbH, Murchin, Mecklenburg-Vorpommern\n\nZweck: Dieses Dokument beschreibt den Ablauf der qualitaetsrelevanten Dokumentenprozesse bei NOC Pharma GmbH gemaess EU-GMP Kapitel 4 und §52a AMG.\n\nGeltungsbereich: Alle Mitarbeiter der Qualitaetssicherung und des regulatorischen Bereichs.`
  },
  "SOP-100_01": {
    filename: "SOP-100_01_Qualitaetsmanagement.docx",
    version: "v1.0", date: "01.01.2023", pages: 18,
    preview: `SOP-100_01  -  Qualitaetsmanagement\nVersion 1.0 | Gueltig ab: 01.01.2023\n\n1. Zweck: Beschreibung des Qualitaetsmanagementsystems bei NOC Pharma GmbH.\n2. Geltungsbereich: Alle GMP-relevanten Bereiche.\n3. Verantwortlichkeiten: Leitung QS, VP §52a AMG, QP §15 AMG.`
  },
  "SOP-QMS-001": {
    filename: "SOP-QMS-001_Pharmazeutisches_Qualitaetssystem.docx",
    version: "v1.0", date: "10.06.2025", pages: 22,
    preview: `SOP-QMS-001  -  Pharmazeutisches Qualitaetssystem\nVersion 1.0 | Gueltig ab: 10.06.2025\n\n1. Zweck: Etablierung und Aufrechterhaltung eines pharmazeutischen Qualitaetssystems gemaess EU-GMP Teil I, ICH Q10 und §52a AMG.\n2. Geltungsbereich: NOC Pharma GmbH, Standorte Murchin und Kahla.\n3. Regulatorische Grundlage: EU-GMP Teil I Kap. 1, ICH Q10, §52a AMG, MedCanG §4.`
  },
  "SOP-BTM-001": {
    filename: "SOP-BTM-001_BtM-Verkehr.docx",
    version: "v1.0", date: "10.06.2025", pages: 14,
    preview: `SOP-BTM-001  -  BtM-Verkehr & Dokumentation\nVersion 1.0 | Gueltig ab: 10.06.2025\n\n1. Zweck: Regelung des ordnungsgemaessen Umgangs mit Betaeubungsmitteln gemaess BtMG §13-15 und BtMVV.\n2. Verantwortliche Person: VP §52a AMG / §7 MedCanG.\n3. Meldepflichten: BfArM, §15 BtMG Jahresbericht.`
  },
  "SOP-604_A7": {
    filename: "SOP-604_A7_BtM-Bestandsaufnahme.xls",
    version: "v1.0", date: "01.01.2024", pages: 1,
    preview: `BtM-Bestandsaufnahme (SOP-604_A7)\nExcel-Tabelle mit 17 Spalten\nSpalten: Substanz | Charge | Anfangsbestand | Zugaenge | Abgaenge | Schlussbestand (K=F+H-J) | Koerperlicher Bestand | Differenz (M=K-L) | VP | Datum\n\nAktuelle Eintraege: Cannabis flos (T20/22), Cannabis flos (T14/16), Dronabinol, CBD-Extrakt`
  },
};

// ── USERS ────────────────────────────────────────────────────
const USERS = {
  "celso@nocpharma.de": {
    password: "NocPharma2026!", name: "Celso Hamelink Chmielewski",
    role: "RP", roleLabel: "VP §52a AMG (RP)",
    permissions: ["generate_sop","send_to_qp","hitl_decisions","upload_zip","btm_access","docusign_send"],
    color: "#3b82f6",
  },
  "torsten.cuny@nocpharma.de": {
    password: "QP_Cuny2026!", name: "Torsten Cuny",
    role: "CEO_QP", roleLabel: "CEO / QP §15 AMG",
    permissions: ["sign_approve","batch_release","final_approval","docusign_sign","generate_sop","hitl_decisions","upload_zip","btm_access","send_to_qp"],
    color: "#10b981",
  },
  "olaf.schagon@nocpharma.de": {
    password: "QA_Schagon2026!", name: "Dr. Olaf Schagon",
    role: "QA", roleLabel: "Leitung QS / QP",
    permissions: ["read_all","author_sop","generate_sop","upload_zip","btm_access"],
    color: "#f59e0b",
  },
  "auditor@nocpharma.de": {
    password: "Audit_Read2026!", name: "Externer Pruefer",
    role: "AUDITOR", roleLabel: "Read-Only Auditor",
    permissions: ["read_all","export_audit_trail"],
    color: "#8b5cf6",
  },
};

const AUDIT_ITEMS = [
  { id:1,  labelDe:"KI-Systembeschreibung",          label:"AI System Description",     reg:"EU AI Act Art.6" },
  { id:2,  labelDe:"Annex III Risikobewertung",      label:"Annex III Risk Assessment", reg:"EU AI Act Annex III" },
  { id:3,  labelDe:"Datenverwaltungsprotokoll",      label:"Data Governance Log",       reg:"EU AI Act Art.10" },
  { id:4,  labelDe:"KI-Inventar",                    label:"AI Inventory",              reg:"EU AI Act Art.49" },
  { id:5,  labelDe:"HITL-Rollen benannt",            label:"HITL Roles Named",          reg:"EU AI Act Art.14" },
  { id:6,  labelDe:"GAMP5-Validierung",              label:"GAMP5 Validation",          reg:"GMP Annex 11" },
  { id:7,  labelDe:"Monatliche Ueberpruefung",         label:"Monthly Review Set",        reg:"EU AI Act Art.9" },
  { id:8,  labelDe:"BfArM-Export OK",                label:"BfArM Export OK",           reg:"BtMG §15" },
  { id:9,  labelDe:"10-Jahres-Aufbewahrung",         label:"10yr Retention",            reg:"EU AI Act Art.12" },
  { id:10, labelDe:"Apothekenpruefung",               label:"Pharmacy Check",            reg:"MedCanG §7" },
  { id:11, labelDe:"Rueckruf 4h-Test",                label:"Recall 4h Test",            reg:"EU AI Act Art.65" },
  { id:12, labelDe:"CE-Kennzeichnung",               label:"CE Marking",                reg:"EU AI Act Art.49" },
  { id:13, labelDe:"Grosshandelsweg",                 label:"Wholesale Route",           reg:"AM-HandelsV" },
  { id:14, labelDe:"COA-Halluzinationspruefung",      label:"COA Hallucination",         reg:"GMP Annex 11" },
  { id:15, labelDe:"Transparenz",                    label:"Transparency",              reg:"EU AI Act Art.13" },
];

const BtM_DATA = [
  { substance:"Cannabis flos (T20/22)", batch:"NOC-CF-2025-001", supplierBatch:"MCCN-2025-062", opening:5000, receipts:2500, issues:1200, physical:6298, unit:"g" },
  { substance:"Cannabis flos (T14/16)", batch:"NOC-CF-2025-002", supplierBatch:"MCCN-2025-063", opening:3000, receipts:1000, issues:800,  physical:3200, unit:"g" },
  { substance:"Dronabinol",             batch:"NOC-DN-2025-001", supplierBatch:"PHARM-2025-001", opening:500,  receipts:200,  issues:150,  physical:552,  unit:"g" },
  { substance:"Cannabis-Extrakt (CBD)", batch:"NOC-CE-2025-001", supplierBatch:"EXT-2025-001",   opening:1000, receipts:500,  issues:300,  physical:1200, unit:"ml" },
];

const LEGAL_UPDATES = [
  { id:1, title:"HITL Override Protocol",  reg:"EU AI Act Art.14",   pri:"high", desc:"HITL override procedure with QP/RP digital signature hinzufuegen." },
  { id:2, title:"AI Audit Trail 10yr",     reg:"Art.12+Annex11§9",   pri:"high", desc:"KI-Audit-Trail, 10-Jahres-Aufbewahrung, alle Entscheidungen protokollieren." },
  { id:3, title:"Pharmacy Brick-Mortar",   reg:"MedCanG/ApoG",       pri:"high", desc:"Apothekenverzeichnis-Verifizierung fuer stationaere Apotheken hinzufuegen." },
  { id:4, title:"AI Transparency",         reg:"Art.13/52",          pri:"medium",desc:"Benutzer ueber KI-generierte vs. menschlich gepruefte Ausgaben informieren." },
  { id:5, title:"Monthly Model Review",    reg:"GAMP5/Art.9",        pri:"high", desc:"Monatliche KI-Drift-Pruefung, Performance-Metriken, Revalidierung." },
];

// ── STYLES ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --navy:#0a1628;--navy2:#0f2040;--navy3:#162d52;
  --blue:#1d4ed8;--bl:#3b82f6;--green:#059669;--gn:#10b981;
  --red:#dc2626;--amber:#d97706;--amber2:#f59e0b;--purple:#7c3aed;
  --g100:#f1f5f9;--g200:#e2e8f0;--g300:#cbd5e1;--g500:#64748b;--g700:#334155;
  --font:'IBM Plex Sans',system-ui,sans-serif;--mono:'IBM Plex Mono',monospace;
  --bdr:1px solid rgba(255,255,255,0.08);--bdrL:1px solid #e2e8f0;
}
body{font-family:var(--font);background:var(--g100);}

/* LOGIN / SPLASH */
.bg-dark{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:var(--navy);
  background-image:radial-gradient(ellipse at 20% 50%,rgba(29,78,216,.15) 0%,transparent 60%),
                   radial-gradient(ellipse at 80% 20%,rgba(16,185,129,.1) 0%,transparent 50%);}
.card-login{background:var(--navy2);border:var(--bdr);border-radius:12px;padding:48px;width:440px;box-shadow:0 25px 60px rgba(0,0,0,.5);}
.nlogo{width:52px;height:52px;background:var(--blue);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;margin:0 auto 20px;}
.login-title{color:#fff;font-size:22px;font-weight:600;text-align:center;margin-bottom:4px;}
.login-sub{color:var(--g300);font-size:13px;text-align:center;margin-bottom:6px;}
.login-regs{color:var(--g500);font-size:11px;text-align:center;margin-bottom:28px;}
.fgrp{margin-bottom:16px;}
.flbl{display:block;color:var(--g300);font-size:13px;margin-bottom:5px;font-weight:500;}
.finp{width:100%;padding:11px 14px;background:var(--navy3);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:14px;font-family:var(--font);transition:border-color .2s;}
.finp:focus{outline:none;border-color:var(--bl);}
.finp::placeholder{color:var(--g500);}
.finp-light{background:#f8fafc;color:#0f172a;border:1px solid #cbd5e1;}
.login-err{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.3);color:#fca5a5;font-size:13px;padding:10px 14px;border-radius:6px;margin-bottom:14px;}
.btn-login{width:100%;padding:13px;background:var(--green);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;font-family:var(--font);transition:background .2s;margin-bottom:18px;}
.btn-login:hover{background:var(--gn);}
.login-comp{background:rgba(255,255,255,.04);border:var(--bdr);border-radius:8px;padding:12px 14px;font-size:11px;color:var(--g500);line-height:1.7;}
.user-quick{margin-top:16px;padding:12px;background:rgba(29,78,216,.08);border:1px solid rgba(29,78,216,.2);border-radius:8px;}
.user-quick-title{color:var(--g300);font-size:11px;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;}
.uq-row{display:flex;justify-content:space-between;padding:5px 0;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.05);}
.uq-row:last-child{border-bottom:none;}
.uq-email{color:var(--bl);font-size:12px;font-family:var(--mono);}
.uq-role{color:var(--g500);font-size:11px;}

/* TOPBAR */
.topbar{background:var(--navy);color:#fff;height:54px;display:flex;align-items:center;padding:0 16px;gap:0;position:sticky;top:0;z-index:200;border-bottom:1px solid rgba(255,255,255,.06);}
.topbar-brand{display:flex;align-items:center;gap:10px;margin-right:14px;flex-shrink:0;}
.tblogo{width:30px;height:30px;background:var(--blue);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;}
.tb-name{font-size:13px;font-weight:600;}
.tb-sub{font-size:10px;color:var(--g500);}
.topbar-nav{display:flex;gap:1px;flex:1;overflow-x:auto;scrollbar-width:none;}
.topbar-nav::-webkit-scrollbar{display:none;}
.nbtn{padding:5px 9px;border:none;background:transparent;color:var(--g300);font-size:11.5px;font-weight:500;cursor:pointer;border-radius:5px;white-space:nowrap;font-family:var(--font);transition:all .15s;display:flex;align-items:center;gap:4px;}
.nbtn:hover{background:rgba(255,255,255,.08);color:#fff;}
.nbtn.act{background:rgba(59,130,246,.2);color:var(--bl);}
.nbadge{background:rgba(245,158,11,.9);color:#fff;font-size:10px;font-weight:700;padding:1px 5px;border-radius:8px;}
.nbadge.g{background:rgba(16,185,129,.9);}
.nbadge.b{background:rgba(59,130,246,.9);}
.tba-row{display:flex;align-items:center;gap:7px;margin-left:10px;flex-shrink:0;}
.lang-btn{padding:5px 9px;background:rgba(255,255,255,.08);border:var(--bdr);border-radius:5px;color:var(--g300);font-size:12px;cursor:pointer;font-family:var(--font);}
.lang-btn:hover{background:rgba(255,255,255,.13);}
.uchip{display:flex;align-items:center;gap:7px;padding:4px 10px;background:rgba(255,255,255,.06);border:var(--bdr);border-radius:5px;}
.udot{width:8px;height:8px;border-radius:50%;}
.uname{font-size:11px;color:var(--g300);}
.btn{padding:6px 12px;border:none;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .15s;}
.btn-b{background:var(--blue);color:#fff;}.btn-b:hover{background:#1e40af;}
.btn-r{background:var(--red);color:#fff;}.btn-r:hover{background:#b91c1c;}
.btn-g{background:var(--green);color:#fff;}.btn-g:hover{background:#047857;}
.btn-o{background:var(--amber);color:#fff;}
.btn-p{background:var(--purple);color:#fff;}
.btn-out{background:transparent;border:1px solid var(--g300);color:var(--g700);}
.btn-out:hover{background:var(--g100);}
.btn-so{background:rgba(255,255,255,.06);color:var(--g300);border:var(--bdr);font-size:11px;padding:5px 10px;border-radius:5px;cursor:pointer;font-family:var(--font);}

/* USER BAR */
.ubar{background:rgba(0,0,0,.2);padding:3px 16px;font-size:11px;color:var(--g500);display:flex;align-items:center;gap:12px;}

/* KPI */
.kpis{display:flex;background:#fff;border-bottom:var(--bdrL);}
.kpi{flex:1;padding:16px 20px;border-right:var(--bdrL);}
.kpi:last-child{border-right:none;}
.kpi-lbl{font-size:10px;color:var(--g500);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;}
.kpi-val{font-size:26px;font-weight:700;color:var(--navy);}
.kpi-val.g{color:var(--green);}.kpi-val.r{color:var(--red);}.kpi-val.a{color:var(--amber);}.kpi-val.b{color:var(--blue);}

/* CONTENT */
.cnt{padding:20px;max-width:1440px;margin:0 auto;}

/* DOC ROWS */
.search-row{display:flex;gap:8px;margin-bottom:14px;align-items:center;}
.sinp{flex:1;padding:9px 13px;border:var(--bdrL);border-radius:7px;font-size:13px;font-family:var(--font);background:#fff;}
.sinp:focus{outline:none;border-color:var(--bl);}
.ssel{padding:9px 13px;border:var(--bdrL);border-radius:7px;font-size:13px;background:#fff;font-family:var(--font);cursor:pointer;}
.rcnt{font-size:12px;color:var(--g500);white-space:nowrap;}

.drow{background:#fff;border:var(--bdrL);border-radius:7px;margin-bottom:3px;overflow:hidden;}
.drow:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);}
.drow.overdue{border-left:3px solid var(--red);}
.drow-hdr{display:flex;align-items:center;padding:9px 12px;cursor:pointer;gap:8px;}
.did{font-family:var(--mono);font-size:11.5px;font-weight:500;color:var(--blue);min-width:130px;}
.did.r{color:var(--red);}
.dtitle{flex:1;font-size:13px;color:var(--g700);}
.dbadge{padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;}
.dbadge-ai{background:#ede9fe;color:#6d28d9;}
.dbadge-upd{background:#fef3c7;color:#92400e;}
.dbadge-od{background:#fee2e2;color:#991b1b;}
.dbadge-act{background:#d1fae5;color:#065f46;}
.dbadge-orig{background:#dbeafe;color:#1e40af;}
.dprog{display:flex;align-items:center;gap:7px;min-width:90px;}
.pbar{flex:1;height:4px;background:var(--g200);border-radius:2px;}
.pfill{height:100%;border-radius:2px;background:var(--blue);}
.ppct{font-size:11px;color:var(--g500);min-width:26px;text-align:right;}
.darr{color:var(--g300);font-size:11px;transition:transform .2s;}
.darr.open{transform:rotate(180deg);}
.dfcnt{font-size:11px;color:var(--g500);}

/* EXPAND */
.dexp{padding:14px 12px;border-top:var(--bdrL);background:#fafbfc;}
.exp-meta{font-size:12px;color:var(--g500);margin-bottom:10px;}
.gap-badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;}
.gbadge{padding:2px 7px;background:#fef2f2;color:var(--red);border:1px solid #fecaca;border-radius:4px;font-size:11px;font-weight:500;}

/* ORIGINAL VERSION BOX */
.orig-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin-bottom:14px;}
.orig-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.orig-title{font-size:13px;font-weight:600;color:#1e40af;}
.orig-meta{font-size:11px;color:#3b82f6;margin-bottom:8px;}
.orig-preview{background:#fff;border:1px solid #bfdbfe;border-radius:5px;padding:10px;font-size:11px;font-family:var(--mono);color:var(--g700);white-space:pre-wrap;max-height:100px;overflow-y:auto;line-height:1.6;}
.orig-none{font-size:12px;color:#93c5fd;font-style:italic;}

/* AI AGENT */
.ai-box{background:#fff;border:var(--bdrL);border-radius:8px;overflow:hidden;}
.ai-hdr{padding:10px 12px;background:var(--g100);border-bottom:var(--bdrL);font-size:13px;font-weight:600;color:var(--navy);display:flex;align-items:center;gap:6px;}
.ai-body{padding:12px;}
.btn-gen{width:100%;padding:11px;background:var(--green);color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);margin-bottom:8px;}
.btn-gen:hover{background:#047857;}
.btn-gen:disabled{background:var(--g300);cursor:not-allowed;}
.gen-banner{background:var(--navy);color:#fff;border-radius:8px;padding:12px 14px;margin-bottom:10px;}
.gen-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.gen-title{font-size:13px;font-weight:600;}
.gen-sub{font-size:11px;color:var(--g300);margin-top:2px;}
.wf-steps{display:flex;gap:2px;margin-bottom:10px;}
.wf-step{flex:1;padding:5px 6px;background:rgba(255,255,255,.1);border-radius:4px;font-size:10px;color:var(--g300);text-align:center;}
.wf-step.act{background:var(--blue);color:#fff;}
.wf-step.done{background:var(--green);color:#fff;}
.gen-cnt{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:10px;max-height:150px;overflow-y:auto;margin-bottom:9px;font-size:11px;color:var(--g300);line-height:1.6;}
.gen-cnt h4{font-size:11px;color:#fff;margin-bottom:3px;}
.gen-cnt p{margin-bottom:4px;}
.ntag{background:rgba(245,158,11,.2);color:var(--amber2);padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700;}
.gen-acts{display:flex;gap:6px;flex-wrap:wrap;}
.upz{border:1px dashed var(--g300);border-radius:5px;padding:8px 12px;text-align:center;font-size:11px;color:var(--g500);cursor:pointer;margin-top:7px;}
.upz:hover{border-color:var(--bl);color:var(--blue);}
.upd-item{display:flex;justify-content:space-between;align-items:flex-start;padding:9px 12px;background:#fff;border:var(--bdrL);border-radius:5px;margin-bottom:5px;}
.upd-l{flex:1;}
.upd-t{font-size:13px;font-weight:600;color:var(--navy);}
.upd-r{font-size:11px;color:var(--blue);margin-top:2px;}
.upd-d{font-size:12px;color:var(--g500);margin-top:2px;}
.pri{padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;}
.pri-high{background:#fee2e2;color:var(--red);}
.pri-medium{background:#fef3c7;color:#92400e;}
.pri-low{background:#d1fae5;color:#065f46;}

/* SECTIONS */
.sec-title{font-size:17px;font-weight:700;color:var(--navy);margin-bottom:3px;}
.sec-sub{font-size:13px;color:var(--g500);margin-bottom:18px;}

/* CARDS */
.card{background:#fff;border:var(--bdrL);border-radius:9px;padding:18px;}

/* AUDIT */
.ci{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:var(--bdrL);border-radius:7px;margin-bottom:5px;}
.ci.done{background:#f0fdf4;border-color:#bbf7d0;}
.cb{width:20px;height:20px;border-radius:4px;border:2px solid var(--g300);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.cb.chk{background:var(--green);border-color:var(--green);color:#fff;font-size:12px;}
.ci-lbl{flex:1;font-size:13px;color:var(--navy);font-weight:500;}
.ci-lbl.done{text-decoration:line-through;color:var(--g500);}
.ci-reg{font-size:11px;color:var(--blue);margin-top:1px;}
.ci-sts{padding:3px 9px;border-radius:8px;font-size:11px;font-weight:700;}
.sts-p{background:#fef3c7;color:#92400e;}
.sts-d{background:#d1fae5;color:#065f46;}

/* TABLES */
.tbl{width:100%;border-collapse:collapse;font-size:12px;}
.tbl th{padding:9px 12px;background:var(--g100);color:var(--g500);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;text-align:left;border-bottom:var(--bdrL);}
.tbl td{padding:9px 12px;border-bottom:var(--bdrL);color:var(--g700);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:var(--g100);}

/* MATRIX */
.mtbl{width:100%;border-collapse:collapse;font-size:11.5px;}
.mtbl th{padding:8px 9px;background:var(--navy);color:#fff;font-size:10px;font-weight:600;text-align:center;white-space:nowrap;}
.mtbl th:first-child,.mtbl th:nth-child(2){text-align:left;}
.mtbl th:nth-child(2){min-width:180px;}
.mtbl td{padding:7px 9px;border-bottom:var(--bdrL);text-align:center;background:#fff;}
.mtbl td:first-child{font-family:var(--mono);font-size:10.5px;color:var(--blue);text-align:left;}
.mtbl td:nth-child(2){text-align:left;font-size:12px;color:var(--g700);}
.mtbl tr:hover td{background:var(--g100);}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;}
.mcard{background:#fff;border-radius:12px;padding:28px;width:480px;box-shadow:0 25px 60px rgba(0,0,0,.3);}
.mcard.wide{width:min(900px,95vw);}
.mtitle{font-size:17px;font-weight:700;color:var(--navy);margin-bottom:5px;}
.msub{font-size:13px;color:var(--g500);margin-bottom:20px;}
.m-stmt{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:7px;padding:12px 14px;font-size:13px;color:var(--g700);margin-bottom:18px;line-height:1.5;}
.m-signer{display:flex;align-items:center;gap:10px;background:var(--g100);border-radius:7px;padding:11px 13px;margin-bottom:18px;}
.m-acts{display:flex;gap:9px;}
.m-acts button{flex:1;padding:11px;border:none;border-radius:7px;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font);}
.sign-ok{background:var(--green);color:#fff;}
.sign-no{background:var(--g100);color:var(--g700);}
.signed-ok{text-align:center;padding:20px;}
.signed-ok .ic{font-size:48px;margin-bottom:10px;}
.signed-ok p{font-size:16px;font-weight:600;color:var(--green);}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;}
.cside{border:var(--bdrL);border-radius:7px;overflow:hidden;}
.cside-hdr{padding:9px 13px;font-size:12px;font-weight:600;}
.cside-hdr.leg{background:#fef2f2;color:var(--red);}
.cside-hdr.nw{background:#f0fdf4;color:var(--green);}
.cside-body{padding:12px;max-height:380px;overflow-y:auto;font-size:11.5px;line-height:1.6;color:var(--g700);}
.cside-body .hl{background:#fef9c3;padding:1px 0;}

/* LOG */
.lrow{display:flex;gap:12px;align-items:flex-start;padding:9px 12px;background:#fff;border:var(--bdrL);border-radius:5px;margin-bottom:3px;}
.ltime{font-family:var(--mono);font-size:11px;color:var(--g500);min-width:130px;}
.lact{padding:2px 7px;border-radius:3px;font-size:11px;font-weight:700;white-space:nowrap;}
.la-done{background:#d1fae5;color:#065f46;}
.la-upd{background:#dbeafe;color:#1e40af;}
.la-sign{background:#ede9fe;color:#4c1d95;}
.la-cls{background:var(--g100);color:var(--g700);}
.la-zip{background:#fef3c7;color:#92400e;}
.la-start{background:var(--g100);color:var(--g700);}
.ltgt{flex:1;font-size:12px;color:var(--g700);}

/* DOCUSIGN */
.env-card{background:#fff;border:var(--bdrL);border-radius:9px;padding:16px;margin-bottom:10px;}
.env-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}
.env-id{font-family:var(--mono);font-size:11px;color:var(--blue);}
.env-title{font-size:14px;font-weight:600;color:var(--navy);}
.env-sop{font-size:12px;color:var(--g500);margin-top:1px;}
.srow{display:flex;align-items:center;gap:9px;padding:7px 0;border-top:var(--bdrL);}
.sav{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
.s-name{font-size:12px;font-weight:500;color:var(--navy);}
.s-role{font-size:11px;color:var(--g500);}
.s-signed{color:var(--green);font-size:12px;font-weight:600;}
.s-await{color:var(--amber);font-size:12px;font-weight:600;}
.s-date{font-size:11px;color:var(--g500);}

/* BtM */
.btm-disc{background:#fff5f5;}
.disc-badge{color:var(--red);font-weight:700;}

/* VALIDATION */
.val-ok{display:flex;align-items:center;gap:8px;padding:10px 13px;background:#d1fae5;border:1px solid #6ee7b7;border-radius:5px;color:#065f46;font-size:13px;font-weight:600;margin-bottom:14px;}
.test-row{display:flex;align-items:center;gap:11px;padding:9px 12px;background:#fff;border:var(--bdrL);border-radius:5px;margin-bottom:3px;}
.tpass{width:20px;height:20px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;flex-shrink:0;}
.tid{font-family:var(--mono);font-size:11px;color:var(--blue);min-width:55px;}
.tname{flex:1;font-size:12px;color:var(--navy);}
.tdate{font-size:11px;color:var(--g500);}

/* USERS */
.ucard{display:flex;align-items:center;gap:12px;padding:14px;background:#fff;border:var(--bdrL);border-radius:9px;margin-bottom:7px;}
.uav{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;flex-shrink:0;}
.ui-name{font-size:14px;font-weight:600;color:var(--navy);}
.ui-email{font-family:var(--mono);font-size:11px;color:var(--g500);margin-top:1px;}
.ui-role{font-size:12px;color:var(--blue);margin-top:1px;}
.ptag{padding:2px 7px;background:var(--g100);border:var(--bdrL);border-radius:8px;font-size:10.5px;color:var(--g700);}
.ptags{display:flex;gap:5px;flex-wrap:wrap;}

/* ZIP MODAL */
.zip-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.zip-stat{padding:12px 14px;border-radius:8px;text-align:center;}
.zip-stat-val{font-size:28px;font-weight:700;}
.zip-stat-lbl{font-size:11px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:.05em;}
.zip-file-list{max-height:260px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:7px;}
.zip-file-row{display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;}
.zip-file-row:last-child{border-bottom:none;}
.zip-file-row.matched{background:#f0fdf4;}
.zip-file-row.unmatched{background:#fef2f2;}
.zip-file-name{flex:1;color:#334155;font-family:var(--mono);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.zip-file-match{font-size:11px;color:#059669;font-weight:600;white-space:nowrap;}
.zip-file-nomatch{font-size:11px;color:#dc2626;font-weight:600;}

/* FOOTER */
.footer{text-align:center;padding:14px;font-size:11px;color:var(--g500);border-top:1px solid #e2e8f0;background:#fff;margin-top:18px;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--g100);}
::-webkit-scrollbar-thumb{background:var(--g300);border-radius:3px;}
`;

const SERIES_OPTS = ["All","legacy","QMS","BTM","AI","CS","MFG","GDP","QC","PER","DOC","EQ","SMF"];

const REG_COLS = [
  {k:"amg",l:"AMG"},{k:"btmg",l:"BtMG"},{k:"medcang",l:"MedCanG"},{k:"eugmp",l:"EU GMP"},
  {k:"gdp",l:"EU GDP"},{k:"pics",l:"PIC/S"},{k:"aiact",l:"AI Act"},{k:"annex11",l:"Annex 11"},
  {k:"cfr11",l:"21 CFR"},{k:"nis2",l:"NIS2"},{k:"iso27",l:"ISO 27001"},{k:"bfarm",l:"BfArM"},
];
const SERIES_REGS = {
  legacy:  {amg:1,btmg:1,medcang:1,eugmp:1,gdp:0,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  QMS:     {amg:1,btmg:0,medcang:1,eugmp:1,gdp:0,pics:1,aiact:1,annex11:1,cfr11:0,nis2:0,iso27:0,bfarm:1},
  BTM:     {amg:1,btmg:1,medcang:1,eugmp:1,gdp:0,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  AI:      {amg:0,btmg:0,medcang:0,eugmp:1,gdp:0,pics:1,aiact:1,annex11:1,cfr11:1,nis2:1,iso27:1,bfarm:1},
  CS:      {amg:1,btmg:0,medcang:0,eugmp:1,gdp:0,pics:1,aiact:1,annex11:1,cfr11:1,nis2:1,iso27:1,bfarm:1},
  MFG:     {amg:1,btmg:1,medcang:1,eugmp:1,gdp:0,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  GDP:     {amg:1,btmg:0,medcang:0,eugmp:1,gdp:1,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  QC:      {amg:1,btmg:0,medcang:1,eugmp:1,gdp:0,pics:1,aiact:0,annex11:1,cfr11:0,nis2:0,iso27:0,bfarm:1},
  PER:     {amg:1,btmg:0,medcang:1,eugmp:1,gdp:0,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  DOC:     {amg:1,btmg:0,medcang:0,eugmp:1,gdp:0,pics:1,aiact:0,annex11:1,cfr11:1,nis2:0,iso27:0,bfarm:1},
  EQ:      {amg:1,btmg:0,medcang:0,eugmp:1,gdp:0,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
  SMF:     {amg:1,btmg:0,medcang:1,eugmp:1,gdp:1,pics:1,aiact:0,annex11:0,cfr11:0,nis2:0,iso27:0,bfarm:1},
};
const MANDATORY_SOPS = [
  {id:"SOP-BTM-001",title:"BtM-Verkehr & Dokumentation",     law:"BtMG §13",    critical:true},
  {id:"SOP-BTM-002",title:"BtM-Einfuhr & Ausfuhr",           law:"BtMG §14",    critical:true},
  {id:"SOP-BTM-003",title:"BtM-Bestandsfuehrung",            law:"BtMG §15",    critical:true},
  {id:"SOP-BTM-004",title:"Vernichtung Betaeubungsmittel",    law:"BtMVV §14",   critical:true},
  {id:"SOP-MFG-005",title:"Chargenfreigabe",                  law:"AMG §17",     critical:true},
  {id:"SOP-MFG-006",title:"Einfuhrverfahren Arzneimittel",    law:"AMG §72",     critical:true},
  {id:"SOP-QMS-001",title:"Pharmazeutisches Qualitaetssystem",law:"EU GMP I",    critical:true},
  {id:"SOP-PER-002",title:"Sachkundige Person (QP)",          law:"AMG §15",     critical:true},
  {id:"SOP-CS-001", title:"Computerized Systems Validation",  law:"Annex 11",    critical:true},
  {id:"SOP-DOC-004",title:"Elektronische Signaturen",         law:"21 CFR 11",   critical:true},
  {id:"SOP-CS-004", title:"Audit Trail Verfahren",            law:"Annex 11 §9", critical:true},
  {id:"SOP-GDP-001",title:"Lagerhaltung & Lagerbedingungen",  law:"EU GDP",      critical:false},
  {id:"SOP-GDP-003",title:"Transport & Distribution",         law:"EU GDP",      critical:false},
  {id:"SOP-QC-006", title:"Cannabis Identitaets-Pruefung",    law:"MedCanG",     critical:false},
  {id:"SOP-AI-01",  title:"Automated QC & Human Override",    law:"EU AI Act Art.14",critical:false},
];
const CYBER_CONTROLS = [
  {id:"CC-01",cat:"NIS2",    title:"Risk Management Policy",         ref:"NIS2 Art.21"},
  {id:"CC-02",cat:"NIS2",    title:"Incident Response Plan",         ref:"NIS2 Art.23"},
  {id:"CC-03",cat:"NIS2",    title:"Supply Chain Security",          ref:"NIS2 Art.21(d)"},
  {id:"CC-04",cat:"NIS2",    title:"Business Continuity Plan",       ref:"NIS2 Art.21(c)"},
  {id:"CC-05",cat:"BSI",     title:"IT-Grundschutz Baseline",        ref:"BSI 200-1"},
  {id:"CC-06",cat:"BSI",     title:"Network Segmentation",           ref:"BSI SYS.3.2"},
  {id:"CC-07",cat:"BSI",     title:"Patch Management",               ref:"BSI OPS.1.1.3"},
  {id:"CC-08",cat:"ISO27001",title:"Information Security Policy",    ref:"ISO 27001 A.5"},
  {id:"CC-09",cat:"ISO27001",title:"Access Control Policy",          ref:"ISO 27001 A.9"},
  {id:"CC-10",cat:"ISO27001",title:"Cryptography Policy",            ref:"ISO 27001 A.10"},
  {id:"CC-11",cat:"ISO27001",title:"Physical Security",              ref:"ISO 27001 A.11"},
  {id:"CC-12",cat:"GMP",     title:"Audit Trail Integrity",          ref:"Annex 11 §9"},
  {id:"CC-13",cat:"GMP",     title:"Electronic Signature Validation",ref:"21 CFR 11.50"},
  {id:"CC-14",cat:"GMP",     title:"Backup & Recovery Tested",       ref:"Annex 11 §16"},
  {id:"CC-15",cat:"GMP",     title:"Annual Penetration Test",        ref:"BSI/NIS2 Art.21"},
];
const TRAINEES = [
  {id:"P1",name:"Celso Hamelink",    role:"VP / RP §52a"},
  {id:"P2",name:"Torsten Cuny",      role:"CEO / QP §15"},
  {id:"P3",name:"Dr. Olaf Schagon", role:"Leitung QS"},
  {id:"P4",name:"QS Mitarbeiter 1", role:"QS"},
  {id:"P5",name:"QS Mitarbeiter 2", role:"QS"},
  {id:"P6",name:"Lagerist 1",        role:"Lager / BtM"},
  {id:"P7",name:"Lagerist 2",        role:"Lager / BtM"},
];
const TRAINING_SOPS = [
  "SOP-QMS-001","SOP-QMS-002","SOP-BTM-001","SOP-BTM-002","SOP-BTM-003",
  "SOP-MFG-005","SOP-MFG-006","SOP-GDP-001","SOP-CS-001","SOP-DOC-004",
  "SOP-PER-001","SOP-AI-01","SOP-QC-006","SOP-CS-004","SOP-QMS-003",
];
const IMPORT_FIELDS = [
  {k:"permitNo",     l:"BfArM Einfuhrerlaubnis-Nr.", req:true},
  {k:"substance",    l:"Betaeubungsmittel / Wirkstoff",req:true},
  {k:"quantity",     l:"Menge",                        req:true},
  {k:"unit",         l:"Einheit (g/ml/kg)",             req:true},
  {k:"supplier",     l:"Lieferant",                    req:true},
  {k:"supplierBatch",l:"Lieferanten-Charge",           req:true},
  {k:"internalBatch",l:"Interne Charge",               req:true},
  {k:"countryOrigin",l:"Herkunftsland",                req:true},
  {k:"importDate",   l:"Einfuhrdatum",                 req:true},
  {k:"invoiceNo",    l:"Rechnungsnummer",              req:false},
  {k:"tempMin",      l:"Transport Temp. Min (C)",      req:false},
  {k:"tempMax",      l:"Transport Temp. Max (C)",      req:false},
  {k:"qpName",       l:"QP Name",                     req:true},
  {k:"rpName",       l:"RP Name (VP §52a)",            req:true},
  {k:"notes",        l:"Bemerkungen",                  req:false},
];

const VALIDATION_DOCS = {
  iq:{ title:"Installationsqualifizierung (IQ)", code:"IQ-NOC-QMS-2026-001", std:"GAMP5 Category 4",
       tests:[{id:"IQ-01",name:"System Installation Verification",date:"2026-02-01"},{id:"IQ-02",name:"Infrastructure & Network Config",date:"2026-02-01"},{id:"IQ-03",name:"Software Version Documentation",date:"2026-02-01"},{id:"IQ-04",name:"Database Schema Verification",date:"2026-02-02"},{id:"IQ-05",name:"Security Configuration",date:"2026-02-02"}] },
  oq:{ title:"Operationsqualifizierung (OQ)", code:"OQ-NOC-QMS-2026-001", std:"GMP Annex 11 / 21 CFR Part 11",
       tests:[{id:"OQ-01",name:"Access Control Annex 11 §12",date:"2026-02-10"},{id:"OQ-02",name:"HITL Decision Authority EU AI Act Art.14",date:"2026-02-10"},{id:"OQ-03",name:"AI Agent Access Control",date:"2026-02-11"},{id:"OQ-04",name:"Audit Trail Annex 11 §9",date:"2026-02-11"},{id:"OQ-05",name:"Electronic Signature 21 CFR Part 11",date:"2026-02-12"},{id:"OQ-06",name:"Session Timeout & Lockout",date:"2026-02-12"}] },
  pq:{ title:"Leistungsqualifizierung (PQ)", code:"PQ-NOC-QMS-2026-001", std:"GAMP5 / ICH Q10 / EU GMP",
       tests:[{id:"PQ-01",name:"Data Integrity ALCOA++",date:"2026-02-17"},{id:"PQ-02",name:"AI Governance EU AI Act",date:"2026-02-17"},{id:"PQ-03",name:"BtM Inventory Calculation K=F+H-J",date:"2026-02-18"},{id:"PQ-04",name:"SOP Generation Accuracy",date:"2026-02-18"},{id:"PQ-05",name:"DocuSign Integration",date:"2026-02-19"},{id:"PQ-06",name:"ZIP Upload & Matching (227/230)",date:"2026-02-19"},{id:"PQ-07",name:"Audit Trail Export CSV",date:"2026-02-20"}] },
};

// ── MAIN APP ─────────────────────────────────────────────────
export default function QMSApp() {
  const [lang, setLang] = useState("de");
  const de = lang === "de";

  // Auth
  const [view, setView] = useState("splash");
  const [user, setUser] = useState(null);
  const [lemail, setLemail] = useState("celso@nocpharma.de");
  const [lpwd, setLpwd] = useState("");
  const [lerr, setLerr] = useState("");

  // App state
  const [tab, setTab] = useState("documents");
  const [q, setQ] = useState("");
  const [series, setSeries] = useState("All");
  const [open, setOpen] = useState({});
  const [generating, setGenerating] = useState({});
  const [generated, setGenerated] = useState({});
  const [stage, setStage] = useState({});
  const [auditChecked, setAuditChecked] = useState({});
  const [signModal, setSignModal] = useState(null);
  const [signPwd, setSignPwd] = useState("");
  const [signDone, setSignDone] = useState(false);
  const [compareModal, setCompareModal] = useState(null);
  const [origPreview, setOrigPreview] = useState({}); // which rows show original preview
  const [uploadedFiles, setUploadedFiles] = useState({}); // sopId -> {name, size, uploadedAt}
  const [zipModal, setZipModal] = useState(false);
  const [zipResult, setZipResult] = useState(null); // {total, matched, unmatched, files}
  const [zipProcessing, setZipProcessing] = useState(false);
  const [trainingState, setTrainingState] = useState({});
  const [cyberChecked, setCyberChecked] = useState({});
  const [mandatoryChecked, setMandatoryChecked] = useState({});
  const [importForm, setImportForm] = useState({});
  const [importSubmitted, setImportSubmitted] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState("All");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [sopAnalysis, setSopAnalysis] = useState({});
  const [sopNewVersion, setSopNewVersion] = useState({});
  const [sopComparison, setSopComparison] = useState({});
  const [sopApproved, setSopApproved] = useState({});
  const [sopAuditTrail, setSopAuditTrail] = useState({});
  const [analysing, setAnalysing] = useState({});
  const [showAI, setShowAI] = useState({});
  const [envelopes, setEnvelopes] = useState([
    { id:"ENV-2026-001", sop:"SOP-100_A6", title:"Ablaufdiagramm Q-Prozesse v2.0", sent:"2026-02-23",
      signers:[{name:"Celso Hamelink",role:"RP",status:"signed",at:"2026-02-23 14:22"},{name:"Torsten Cuny",role:"QP",status:"awaiting"},{name:"Dr. Olaf Schagon",role:"QA",status:"awaiting"}]},
    { id:"ENV-2026-002", sop:"SOP-QMS-001", title:"Pharmazeutisches Qualitaetssystem v2.0", sent:"2026-02-22",
      signers:[{name:"Torsten Cuny",role:"QP",status:"signed",at:"2026-02-22 09:15"},{name:"Celso Hamelink",role:"RP",status:"signed",at:"2026-02-22 11:30"},{name:"Dr. Olaf Schagon",role:"QA",status:"awaiting"}]},
  ]);
  const [log, setLog] = useState([
    {time:"23.2.2026, 11:26:45",action:"AI_DONE",target:"SOP-100_A6",type:"done"},
    {time:"23.2.2026, 11:25:52",action:"AI_UPDATE",target:"SOP-100_A6",type:"upd"},
    {time:"23.2.2026, 11:25:34",action:"CLOSE_DOC",target:"SOP-100_A6-01_Ablaufdiagramm Q-Prozesse Dokumente.pdf",type:"cls"},
    {time:"23.2.2026, 11:25:16",action:"ZIP",target:"227/230",type:"zip"},
    {time:"23.2.2026, 11:24:16",action:"START",target:"Session",type:"start"},
  ]);

  const addLog = useCallback((action, target, type) => {
    const now = new Date();
    const time = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}, ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setLog(p => [{time,action,target,type},...p]);
  }, []);

  const canDo = (p) => user?.permissions?.includes(p);

  const doLogin = () => {
    const u = USERS[lemail.toLowerCase()];
    if (u && u.password === lpwd) {
      setUser({email:lemail.toLowerCase(),...u});
      setView("main");
      addLog("LOGIN", lemail, "start");
      setLerr("");
    } else {
      setLerr(de ? "Ungueltige Anmeldedaten. Bitte erneut versuchen." : "Invalid credentials. Please try again.");
      addLog("LOGIN_FAIL", lemail, "start");
    }
  };

  const doGenerate = async (sopId) => {
    if (!canDo("generate_sop")) return;
    setGenerating(p=>({...p,[sopId]:true}));
    addLog("AI_START", sopId, "upd");
    await new Promise(r=>setTimeout(r,1800));
    setGenerating(p=>({...p,[sopId]:false}));
    setGenerated(p=>({...p,[sopId]:true}));
    setStage(p=>({...p,[sopId]:"ai_generated"}));
    addLog("AI_DONE", sopId, "done");
  };

  const doStage = (sopId, s) => {
    setStage(p=>({...p,[sopId]:s}));
    addLog("STAGE_CHANGE", `${sopId} → ${s}`, "upd");
  };

  const doSign = () => {
    if (signPwd === user.password) {
      setSignDone(true);
      doStage(signModal.sopId, "active");
      addLog("E_SIGN", `${signModal.sopId} signed by ${user.name} (${user.roleLabel})`, "sign");
      setTimeout(()=>setSignModal(null), 1800);
    }
  };

  const doDocuSign = (sopId, sopTitle) => {
    const env = {
      id:`ENV-2026-${String(envelopes.length+1).padStart(3,"0")}`,
      sop:sopId, title:`${sopTitle} v2.0`,
      sent:new Date().toISOString().split("T")[0],
      signers:[
        {name:"Celso Hamelink",role:"RP",status:user.role==="RP"?"signed":"awaiting",at:user.role==="RP"?new Date().toLocaleString("de-DE"):null},
        {name:"Torsten Cuny",role:"QP",status:"awaiting"},
        {name:"Dr. Olaf Schagon",role:"QA",status:"awaiting"},
      ]
    };
    setEnvelopes(p=>[env,...p]);
    addLog("DOCUSIGN_SENT", `${sopId} envelope created`, "sign");
  };

  const handleFileUpload = (sopId, e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadedFiles(p=>({...p,[sopId]:{name:f.name,size:(f.size/1024).toFixed(1)+"KB",uploadedAt:new Date().toLocaleString("de-DE")}}));
    addLog("FILE_UPLOAD", `${sopId}: ${f.name}`, "cls");
  };

  // ZIP upload  -  match files to SOPs by filename similarity
  const handleZipUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setZipProcessing(true);
    setZipModal(true);
    addLog("ZIP_START", f.name, "zip");
    // Simulate processing (real impl would use JSZip)
    await new Promise(r=>setTimeout(r,2200));
    const allIds = ALL_SOPS.map(s=>s.id);
    // Simulate match results  -  in real app JSZip would extract filenames
    const simFiles = allIds.slice(0, 227).map(id => ({
      filename: `${id}_${ALL_SOPS.find(s=>s.id===id)?.title?.replace(/[^a-zA-Z0-9]/g,"_").slice(0,30)}.pdf`,
      matchedId: id,
      matched: true,
    }));
    const unmatched = [
      {filename:"_ARCHIVE_old_version_2019.pdf", matched:false},
      {filename:"TEMP_working_copy.docx", matched:false},
      {filename:"~$SOP-100_A6.docx", matched:false},
    ];
    const result = {
      total: simFiles.length + unmatched.length,
      matched: simFiles.length,
      unmatched: unmatched.length,
      files: [...simFiles, ...unmatched],
    };
    // Save all matched originals into uploadedFiles state (preserving originals)
    const newUploads = {};
    simFiles.forEach(file => {
      newUploads[file.matchedId] = {
        name: file.filename,
        size: (Math.random()*500+50).toFixed(0)+"KB",
        uploadedAt: new Date().toLocaleString("de-DE"),
        fromZip: true,
        originalPreserved: true,
      };
    });
    setUploadedFiles(p=>({...p,...newUploads}));
    setZipResult(result);
    setZipProcessing(false);
    addLog("ZIP_DONE", result.matched+"/"+result.total+" matched, auto-generating "+result.unmatched+" missing", "zip");
    // AUTO-GENERATE v1.0 for all missing docs
    const missing = ALL_SOPS.filter(s=>!newUploads[s.id]);
    for(const sop of missing.slice(0,50)){
      setGenerated(p=>({...p,[sop.id]:true}));
      setStage(p=>({...p,[sop.id]:"ai_generated"}));
    }
    if(missing.length>0) addLog("AI_BATCH", "v1.0 auto-generated fuer "+missing.length+" fehlende Dokumente", "done");
  };

  const addAuditEntry = (sopId, act, details) => {
    setSopAuditTrail(p=>({...p,[sopId]:[...(p[sopId]||[]),{action:act,user:user?.name||"System",role:user?.role||"System",timestamp:new Date().toISOString(),details}]}));
    addLog(act, sopId+": "+details, "cls");
  };

  const runSopAnalysis = async (sopId, sopTitle) => {
    const uf = uploadedFiles[sopId];
    if(!uf) { alert("Bitte zuerst Datei hochladen."); return; }
    setAnalysing(p=>({...p,[sopId]:true}));
    addAuditEntry(sopId,"AI_START","Analyse gestartet");
    try {
      const r = await fetch("/api/ai-agent",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"analyse",sopId,sopTitle,extractedText:uf.extractedText||"SOP: "+sopTitle})});
      const d = await r.json();
      if(d.ok){
        setSopAnalysis(p=>({...p,[sopId]:d}));
        setShowAI(p=>({...p,[sopId]:"analysis"}));
        addAuditEntry(sopId,"AI_DONE",d.urgent?"KRITISCH":d.needsUpdate?"Update noetig":"Konform");
      }
    } catch(e){ console.error(e); }
    setAnalysing(p=>({...p,[sopId]:false}));
  };

  const generateSopUpdate = async (sopId, sopTitle) => {
    const uf = uploadedFiles[sopId];
    setAnalysing(p=>({...p,[sopId]:true}));
    addAuditEntry(sopId,"GEN_START","Neue Version wird generiert");
    try {
      const r = await fetch("/api/ai-agent",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"generate",sopId,sopTitle,extractedText:uf?.extractedText||"SOP: "+sopTitle})});
      const d = await r.json();
      if(d.ok){
        setSopNewVersion(p=>({...p,[sopId]:d.updatedSOP}));
        setShowAI(p=>({...p,[sopId]:"newversion"}));
        addAuditEntry(sopId,"GEN_DONE","Neue Version generiert");
      }
    } catch(e){ console.error(e); }
    setAnalysing(p=>({...p,[sopId]:false}));
  };

  const runSopComparison = async (sopId, sopTitle) => {
    const uf = uploadedFiles[sopId];
    const nv = sopNewVersion[sopId];
    if(!nv){ alert("Bitte zuerst neue Version generieren."); return; }
    setAnalysing(p=>({...p,[sopId]:true}));
    try {
      const r = await fetch("/api/ai-agent",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"compare",sopId,sopTitle,oldText:uf?.extractedText||"Original",newText:nv})});
      const d = await r.json();
      if(d.ok){
        setSopComparison(p=>({...p,[sopId]:d}));
        setShowAI(p=>({...p,[sopId]:"compare"}));
        addAuditEntry(sopId,"COMPARE_DONE",d.approved?"Freigabe empfohlen":"Ueberarbeitung noetig");
      }
    } catch(e){ console.error(e); }
    setAnalysing(p=>({...p,[sopId]:false}));
  };

  const approveSop = (sopId) => {
    if(!user||!["QP","RP"].includes(user.role)){ alert("Nur QP/RP kann freigeben."); return; }
    setSopApproved(p=>({...p,[sopId]:true}));
    setStage(p=>({...p,[sopId]:"active"}));
    addAuditEntry(sopId,"QP_APPROVED","Freigegeben gemaess §15 AMG + Annex 11");
    addLog("QP_SIGN", sopId+" freigegeben", "sign");
  };

  const auditDone = Object.values(auditChecked).filter(Boolean).length;

  const stages4 = ["ai_generated","rp_review","qp_signature","active"];
  const stageLabels = ["🤖 KI","👁 RP","✍ QP","✅ Aktiv"];

  const filtered = ALL_SOPS.filter(s => {
    const sq = q.toLowerCase();
    const mq = !sq || s.id.toLowerCase().includes(sq) || s.title.toLowerCase().includes(sq);
    const ms = series==="All" || s.series===series;
    return mq && ms;
  });

  // ── RENDER ──────────────────────────────────────────────────

  // SPLASH
  if (view==="splash") return (
    <>
      <style>{CSS}</style>
      <div className="bg-dark">
        <div style={{background:"#fff",borderRadius:14,padding:"44px 48px",maxWidth:540,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          <div className="nlogo" style={{background:de?"#0a1628":"#1d4ed8"}}>N</div>
          <div style={{fontSize:24,fontWeight:700,color:"#0a1628",marginBottom:4}}>NOC Pharma GmbH</div>
          <div style={{fontSize:14,color:"#64748b",marginBottom:16}}>{de?"Qualitaetsmanagementsystem · Murchin, MV":"Quality Management System · Murchin, MV"}</div>
          <div style={{fontSize:14,color:"#334155",marginBottom:6}}>
            <strong>419</strong> {de?"Dokumente geladen.":"Documents loaded."} <strong>241 SOPs</strong> {de?"gescannt.":"scanned."} <span style={{color:"#dc2626",fontWeight:600}}>145 SOPs</span> {de?"erfordern 297 Aktualisierungen.":"require 297 updates."}
          </div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:24,lineHeight:1.5}}>
            {de?"KI-Agent erstellt und aktualisiert SOPs gemaess PIC/S GMP, MedCanG, EU AI Act 2026. Alle KI-Ergebnisse erfordern QP/RP-Freigabe (Art.14).":"AI Agent creates and updates SOPs per PIC/S GMP, MedCanG, EU AI Act 2026. All AI results require QP/RP approval (Art.14)."}
          </div>
          <div style={{background:"#f1f5f9",borderRadius:8,padding:"12px 16px",fontSize:12,color:"#64748b",marginBottom:24,textAlign:"left",lineHeight:1.8}}>
            <strong style={{color:"#0a1628"}}>{de?"Regulatorische Konformitaet:":"Regulatory Compliance:"}</strong> AMG · BtMG · EU GMP · Annex 11<br/>
            RP: Celso Hamelink · QP: Torsten Cuny · QA: Dr. Olaf Schagon<br/>
            {de?"Aufsicht: BfArM · LAGuS MV · LB Thueringen":"Supervision: BfArM · LAGuS MV · LB Thueringen"}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <button className="lang-btn" style={{flex:1,padding:9}} onClick={()=>setLang("de")}>🇩🇪 Deutsch</button>
            <button className="lang-btn" style={{flex:1,padding:9}} onClick={()=>setLang("en")}>🇬🇧 English</button>
          </div>
          <button style={{width:"100%",padding:14,background:"#0a1628",color:"#fff",border:"none",borderRadius:9,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"}} onClick={()=>setView("login")}>
            {de?"Qualitaetsmanagementsystem betreten":"Enter Quality Management System"}
          </button>
        </div>
      </div>
    </>
  );

  // LOGIN
  if (view==="login") return (
    <>
      <style>{CSS}</style>
      <div className="bg-dark">
        <div className="card-login">
          <div className="nlogo">N</div>
          <div className="login-title">NOC Pharma GmbH</div>
          <div className="login-sub">{de?"Qualitaetsmanagementsystem":"Quality Management System"}</div>
          <div className="login-regs">EU GMP · EU GDP · PIC/S PE 009-17 · MedCanG · AMG</div>
          {lerr && <div className="login-err">{lerr}</div>}
          <div className="fgrp">
            <label className="flbl">{de?"E-Mail":"Email"}</label>
            <input className="finp" type="email" value={lemail} onChange={e=>setLemail(e.target.value)} placeholder="user@nocpharma.de"/>
          </div>
          <div className="fgrp">
            <label className="flbl">{de?"Passwort":"Password"}</label>
            <input className="finp" type="password" value={lpwd} onChange={e=>setLpwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••"/>
          </div>
          <button className="btn-login" onClick={doLogin}>{de?"Anmelden":"Sign In"}</button>
          <div className="login-comp">
            🔒 {de?"Audit: Alle Anmeldeversuche protokolliert (Annex 11 §9)":"Audit: All login attempts are logged (Annex 11 §9)"}<br/>
            ⏱ {de?"Sitzungs-Timeout: 30 Min. (21 CFR Part 11 §11.300)":"Session: 30min timeout (21 CFR Part 11 §11.300)"}<br/>
            RP: celso@nocpharma.de · QP: torsten.cuny@nocpharma.de · QA: olaf.schagon@nocpharma.de
          </div>
          <div className="user-quick">
            <div className="user-quick-title">{de?"Schnellanmeldung":"Quick Login"}</div>
            {Object.entries(USERS).map(([email,u])=>(
              <div key={email} className="uq-row" onClick={()=>{setLemail(email);setLpwd(u.password);}}>
                <span className="uq-email">{email}</span>
                <span className="uq-role">{u.roleLabel}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,marginTop:14}}>
            <button className="lang-btn" style={{flex:1}} onClick={()=>setLang("de")}>🇩🇪 DE</button>
            <button className="lang-btn" style={{flex:1}} onClick={()=>setLang("en")}>🇬🇧 EN</button>
          </div>
        </div>
      </div>
    </>
  );

  // MAIN
  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:"#f1f5f9"}}>

        {/* USER BAR */}
        <div className="ubar">
          <span>{de?"Angemeldet als":"Signed in as"} <strong style={{color:"#94a3b8"}}>{user.name}</strong> ({user.roleLabel}) &#8212; {user.email}</span>
          <button className="btn-so" style={{marginLeft:"auto"}} onClick={()=>{setView("login");setUser(null);}}>↩ {de?"Abmelden":"Sign Out"}</button>
        </div>

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-brand">
            <div className="tblogo">N</div>
            <div>
              <div className="tb-name">NOC Pharma GmbH &#8212; QMS</div>
              <div className="tb-sub">AMG · BtMG · EU GMP · Annex 11</div>
            </div>
          </div>
          <div className="topbar-nav">
            {[
              {k:"documents",l:de?"Dokumente":"Documents"},
              {k:"updates",l:de?"Aktualisierungen":"Updates",badge:"297"},
              {k:"versions",l:de?"Versionen":"Versions",badge:"0"},
              {k:"suggest",l:de?"Vorschlaege":"Suggest",badge:"20"},
              {k:"vault",l:de?"Archiv":"Vault",badge:"0"},
              {k:"sopmatrix",l:`SOP Matrix (66)`,badgeC:"b"},
              {k:"matrix",l:"Matrix"},
              {k:"hitl",l:"HITL"},
              {k:"audit",l:`${de?"Audit":"Audit"} ${auditDone}/15`,badgeC:"g"},
              {k:"log",l:`${de?"Protokoll":"Log"} ${log.length}`},
              {k:"docusign",l:"DocuSign"},
              {k:"btm",l:"BtM"},
              {k:"validation",l:"GAMP5"},
              {k:"users",l:de?"Benutzer":"Users"},
            ].map(i=>(
              <button key={i.k} className={`nbtn ${tab===i.k?"act":""}`} onClick={()=>setTab(i.k)}>
                {i.l}
                {i.badge&&<span className={`nbadge ${i.badgeC||""}`}>{i.badge}</span>}
              </button>
            ))}
          </div>
          <div className="tba-row">
            <button className="lang-btn" onClick={()=>setLang(de?"en":"de")}>{de?"🇬🇧 EN":"🇩🇪 DE"}</button>
            <div className="uchip"><div className="udot" style={{background:user.color}}/><span className="uname">{user.role}</span></div>
            {canDo("upload_zip")&&(
              <label style={{cursor:"pointer"}}>
                <span className="btn btn-b">📁 {de?"ZIP hochladen":"Upload ZIP"}</span>
                <input type="file" style={{display:"none"}} accept=".zip" onChange={handleZipUpload}/>
              </label>
            )}
            {canDo("generate_sop")&&<button className="btn btn-r">⚡ {de?"Alle aktualisieren":"Batch Update All"}</button>}
          </div>
        </div>

        {/* KPI BAR */}
        <div className="kpis">
          {[
            {l:"SOPs",v:"305",c:""},
            {l:de?"Dateien":"Files",v:Object.keys(uploadedFiles).length>0?String(Object.keys(uploadedFiles).length):"0",c:Object.keys(uploadedFiles).length>0?"g":""},
            {l:"Updates",v:"297",c:"r"},
            {l:"Audit",v:`${auditDone}/15`,c:auditDone===15?"g":"a"},
            {l:"Cyber",v:`${Object.values(cyberChecked).filter(Boolean).length}/15`,c:Object.values(cyberChecked).filter(Boolean).length===15?"g":"a"},
            {l:"Pflicht",v:`${Object.values(mandatoryChecked).filter(Boolean).length}/${MANDATORY_SOPS.length}`,c:Object.values(mandatoryChecked).filter(Boolean).length===MANDATORY_SOPS.length?"g":"r"},
          ].map(k=>(
            <div key={k.l} className="kpi">
              <div className="kpi-lbl">{k.l}</div>
              <div className={`kpi-val ${k.c}`}>{k.v}</div>
            </div>
          ))}
        </div>

        <div className="cnt">

          {/* ── DOCUMENTS ── */}
          {tab==="documents"&&(
            <div>
              <div className="search-row">
                <input className="sinp" placeholder={de?"SOPs suchen...":"Search SOPs..."} value={q} onChange={e=>setQ(e.target.value)}/>
                <select className="ssel" value={series} onChange={e=>setSeries(e.target.value)}>
                  {SERIES_OPTS.map(s=><option key={s}>{s}</option>)}
                </select>
                <span className="rcnt">{filtered.length} {de?"Ergebnisse":"results"}</span>
              </div>

              {filtered.map(sop=>{
                const isOpen = open[sop.id];
                const isGen = generated[sop.id];
                const isGenerating = generating[sop.id];
                const curStage = stage[sop.id]||(isGen?"ai_generated":null);
                const orig = ORIGINAL_VERSIONS[sop.id];
                const showOrig = origPreview[sop.id];
                const uploadedFile = uploadedFiles[sop.id];

                return (
                  <div key={sop.id} className={`drow ${sop.overdue?"overdue":""}`}>
                    <div className="drow-hdr" onClick={()=>setOpen(p=>({...p,[sop.id]:!p[sop.id]}))}>
                      <span className={`did ${sop.overdue?"r":""}`}>{sop.id}</span>
                      <span className="dtitle">{sop.title}</span>
                      {sop.aiReady&&<span className="dbadge dbadge-ai">🤖 AI READY</span>}
                      {(sop.updates||0)>0&&<span className="dbadge dbadge-upd">⚠ {sop.updates}</span>}
                      {sop.overdue&&<span className="dbadge dbadge-od">🔴 ~{sop.overdueDays}d</span>}
                      {curStage==="active"&&<span className="dbadge dbadge-act">✅ AKTIV</span>}
                      {orig&&<span className="dbadge dbadge-orig">📄 v1</span>}
                      {uploadedFile&&<span className="dbadge" style={{background:"#d1fae5",color:"#065f46"}}>📎 ZIP</span>}
                      <div className="dprog">
                        <div className="pbar"><div className="pfill" style={{width:`${sop.progress}%`}}/></div>
                        <span className="ppct">{sop.progress}%</span>
                      </div>
                      <span className="dfcnt">📄 {orig||uploadedFile?1:0}</span>
                      <span className={`darr ${isOpen?"open":""}`}>▼</span>
                    </div>

                    {isOpen&&(
                      <div className="dexp">
                        <div className="exp-meta">
                          <span>Version 1 · 2020-11-13</span>
                          {orig&&<span style={{color:"#059669",marginLeft:12}}>✅ 1 {de?"Datei im Archiv":"file(s) in archive"}</span>}
                          {uploadedFile&&<span style={{color:"#059669",marginLeft:12}}>📎 {uploadedFile.name} ({uploadedFile.size}) &#8212; {uploadedFile.uploadedAt}</span>}
                        </div>

                        {/* ORIGINAL VERSION PREVIEW */}
                        {(orig || uploadedFile?.originalPreserved) && (
                          <div className="orig-box">
                            <div className="orig-hdr">
                              <span className="orig-title">
                                📄 {uploadedFile?.fromZip
                                  ? (de?"Originalversion  -  gespeichert aus ZIP-Upload":"Original Version  -  Saved from ZIP Upload")
                                  : (de?"Originalversion (aus ZIP-Archiv)":"Original Version (from ZIP archive)")}
                              </span>
                              <button className="btn btn-out" style={{fontSize:"11px",padding:"3px 9px"}}
                                onClick={e=>{e.stopPropagation();setOrigPreview(p=>({...p,[sop.id]:!p[sop.id]}))}}>
                                {showOrig?(de?"Ausblenden":"Hide"):(de?"Anzeigen":"Preview")}
                              </button>
                            </div>
                            <div className="orig-meta">
                              {uploadedFile?.fromZip
                                ? <>📦 {de?"Aus ZIP":"From ZIP"}: {uploadedFile.name} · {uploadedFile.size} · {de?"Hochgeladen":"Uploaded"}: {uploadedFile.uploadedAt}</>
                                : orig && <>📁 {orig.filename} · {orig.version} · {orig.date} · {orig.pages} {de?"Seiten":"pages"}</>
                              }
                            </div>
                            {showOrig && (
                              <div className="orig-preview">
                                {orig?.preview ||
                                  `[${sop.id}] ${sop.title}\n${de?"Originalversion aus ZIP-Archiv":"Original version from ZIP archive"}\n${de?"Datei":"File"}: ${uploadedFile?.name}\n${de?"Hochgeladen am":"Uploaded at"}: ${uploadedFile?.uploadedAt}\n\n${de?"Inhalt wird nach vollstaendiger JSZip-Integration angezeigt. Die Datei ist gespeichert und fuer den Vergleich verfuegbar.":"Content shown after full JSZip integration. File is preserved and available for comparison."}`
                                }
                              </div>
                            )}
                            <div style={{marginTop:8,display:"flex",gap:6}}>
                              <button className="btn btn-out" style={{fontSize:"11px"}} onClick={()=>setCompareModal(sop)}>
                                ⇔ {de?"Alt vs. Neu vergleichen":"Compare Old vs New"}
                              </button>
                              <span style={{fontSize:"11px",color:"#059669",alignSelf:"center"}}>
                                ✅ {de?"Original gesichert · unveraenderlich":"Original preserved · immutable"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* MISSING FILE BOX */}
                        {!uploadedFile&&!isGen&&sop.progress===0&&(
                          <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:14,marginBottom:14}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#92400e",marginBottom:6}}>
                              Dokument fehlt im System
                            </div>
                            <div style={{fontSize:12,color:"#78350f",marginBottom:10,lineHeight:1.6}}>
                              Kein Original im ZIP gefunden. Jetzt KI-Erstversion generieren oder manuell hochladen.
                              {MANDATORY_SOPS.find(m=>m.id===sop.id)&&<span style={{color:"#dc2626",fontWeight:700}}> - PFLICHT: {MANDATORY_SOPS.find(m=>m.id===sop.id)?.law}</span>}
                            </div>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              {canDo("generate_sop")&&(
                                <button style={{padding:"7px 14px",background:"#059669",color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"}}
                                  onClick={()=>doGenerate(sop.id)}>
                                  {isGenerating?"Generiere...":"KI: Erstversion v1.0 generieren"}
                                </button>
                              )}
                              <label style={{cursor:"pointer"}}>
                                <span style={{padding:"7px 14px",background:"#1d4ed8",color:"#fff",borderRadius:6,fontSize:12,fontWeight:600,display:"inline-block"}}>Datei hochladen</span>
                                <input type="file" style={{display:"none"}} onChange={e=>handleFileUpload(sop.id,e)} accept=".pdf,.docx,.xlsx"/>
                              </label>
                            </div>
                          </div>
                        )}

                        {showAI[sop.id]&&sopAnalysis[sop.id]&&(
                          <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:14,marginBottom:12,fontSize:12}}>
                            <div style={{fontWeight:700,marginBottom:8,color:sopAnalysis[sop.id].urgent?"#dc2626":sopAnalysis[sop.id].needsUpdate?"#d97706":"#16a34a"}}>
                              🔍 KI-Analyse: {sopAnalysis[sop.id].urgent?"🔴 DRINGEND":sopAnalysis[sop.id].needsUpdate?"⚠️ Update noetig":"✅ Konform"}
                            </div>
                            <div style={{whiteSpace:"pre-wrap",lineHeight:1.6,maxHeight:300,overflowY:"auto",color:"#374151"}}>
                              {sopAnalysis[sop.id].regCheck}
                            </div>
                          </div>
                        )}
                        {showAI[sop.id]==="newversion"&&sopNewVersion[sop.id]&&(
                          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:14,marginBottom:12,fontSize:12}}>
                            <div style={{fontWeight:700,marginBottom:8,color:"#15803d"}}>🤖 Neue Version generiert</div>
                            <pre style={{whiteSpace:"pre-wrap",maxHeight:300,overflowY:"auto",fontSize:11,fontFamily:"monospace",color:"#374151"}}>
                              {sopNewVersion[sop.id].substring(0,2000)}
                            </pre>
                          </div>
                        )}
                        {showAI[sop.id]==="compare"&&sopComparison[sop.id]&&(
                          <div style={{background:"#1e293b",borderRadius:8,padding:14,marginBottom:12}}>
                            <div style={{fontWeight:700,marginBottom:8,color:"#e2e8f0",fontSize:12}}>⇔ Vergleichsbericht</div>
                            <div style={{whiteSpace:"pre-wrap",maxHeight:400,overflowY:"auto",fontSize:11,color:"#94a3b8",lineHeight:1.6}}>
                              {sopComparison[sop.id].comparison}
                            </div>
                            {sopComparison[sop.id].approved&&!sopApproved[sop.id]&&canDo("sign_approve")&&(
                              <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center"}}>
                                <span style={{color:"#86efac",fontSize:12,fontWeight:700}}>✅ Freigabe empfohlen</span>
                                <button style={{padding:"6px 14px",background:"#16a34a",color:"white",border:"none",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer"}}
                                  onClick={()=>approveSop(sop.id)}>QP freigeben & archivieren</button>
                              </div>
                            )}
                            {sopAuditTrail[sop.id]?.length>0&&(
                              <div style={{marginTop:10,borderTop:"1px solid #334155",paddingTop:8}}>
                                <div style={{fontSize:10,color:"#64748b",fontWeight:700,marginBottom:4}}>AUDIT TRAIL</div>
                                {sopAuditTrail[sop.id].map((e,i)=>(
                                  <div key={i} style={{fontSize:10,color:"#94a3b8",fontFamily:"monospace"}}>
                                    {new Date(e.timestamp).toLocaleString("de-DE")} · {e.user} · {e.action} · {e.details}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {(sop.updates||0)>0&&(
                          <div>
                            <div className="gap-badges">
                              {["A11§9","A11§4","A11§5"].map(g=><span key={g} className="gbadge">⚠ {g}</span>)}
                            </div>
                            <div style={{fontSize:"12px",fontWeight:"600",color:"#334155",marginBottom:"8px"}}>
                              ⚠ {sop.updates} {de?"Rechtliche Aktualisierung(en) erforderlich":"Legal Update(s) Required"}
                            </div>
                            {LEGAL_UPDATES.slice(0,sop.updates).map(u=>(
                              <div key={u.id} className="upd-item">
                                <div className="upd-l">
                                  <div className="upd-t">{u.title}</div>
                                  <div className="upd-r">{u.reg}</div>
                                  <div className="upd-d">{u.desc}</div>
                                </div>
                                <span className={`pri pri-${u.pri}`}>{u.pri.toUpperCase()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* AI AGENT */}
                        <div className="ai-box">
                          <div className="ai-hdr">🤖 {de?"KI-Dokumentenagent":"AI Document Agent"}</div>
                          <div className="ai-body">
                            {!isGen?(
                              <>
                                <button className="btn-gen" disabled={isGenerating||!canDo("generate_sop")} onClick={()=>doGenerate(sop.id)}>
                                  {isGenerating?`⏳ ${de?"Generiere...":"Generating..."}`:`📄 ${de?"Neues SOP generieren":"Generate New SOP"}`}
                                </button>
                                <button className="btn-gen" style={{background:"#1d4ed8"}} disabled={isGenerating||!canDo("generate_sop")} onClick={()=>doGenerate(sop.id)}>
                                  {isGenerating?`⏳`:`🔄 ${de?"Mit KI aktualisieren":"Update with AI"}`}
                                </button>
                              </>
                            ):(
                              <div className="gen-banner">
                                <div className="gen-top">
                                  <div>
                                    <div className="gen-title">✅ SOP v2.0 {de?"generiert &#8212; Bereit zur Pruefung":"Generated &#8212; Ready for Review"}</div>
                                    <div className="gen-sub">AMG · BtMG · EU GMP · EU AI Act Art.14 HITL</div>
                                  </div>
                                </div>
                                <div className="wf-steps">
                                  {stages4.map((s,i)=>(
                                    <div key={s} className={`wf-step ${curStage===s?"act":stages4.indexOf(s)<stages4.indexOf(curStage)?"done":""}`}>
                                      {stageLabels[i]}
                                    </div>
                                  ))}
                                </div>
                                <div className="gen-cnt">
                                  <h4>## 1. Zweck und Anwendungsbereich</h4>
                                  <p>Diese SAW definiert die Verfahren bei NOC Pharma GmbH gemaess §52a AMG, §7 MedCanG sowie PIC/S GMP PE 009-17 Kapitel 4. <span className="ntag">[NEU 2026]</span> Integration von KI-unterstuetzten Dokumentationsprozessen gemaess EU AI Act Art.6 und Annex III.</p>
                                  <h4>## 2. Geltungsbereich</h4>
                                  <p>Gilt fuer alle qualitaetsrelevanten Dokumente der NOC Pharma GmbH. <span className="ntag">[NEU 2026]</span> KI-generierte Inhalte und HITL Override-Dokumentation eingeschlossen.</p>
                                </div>
                                <div className="gen-acts">
                                  {curStage==="ai_generated"&&canDo("send_to_qp")&&(
                                    <button className="btn btn-b" style={{fontSize:"11px"}} onClick={()=>doStage(sop.id,"rp_review")}>
                                      📤 {de?"An RP senden":"Send to RP"}
                                    </button>
                                  )}
                                  {curStage==="rp_review"&&(canDo("sign_approve")||canDo("send_to_qp"))&&(
                                    <button className="btn btn-g" style={{fontSize:"11px"}} onClick={()=>doStage(sop.id,"qp_signature")}>
                                      ✍ {de?"An QP senden":"Send to QP"}
                                    </button>
                                  )}
                                  {curStage==="qp_signature"&&(canDo("sign_approve")||canDo("final_approval"))&&(
                                    <button className="btn btn-g" style={{fontSize:"11px"}} onClick={()=>setSignModal({sopId:sop.id,sopTitle:sop.title})}>
                                      🔏 {de?"Signieren":"Sign"}
                                    </button>
                                  )}
                                  <button className="btn btn-out" style={{fontSize:"11px"}} onClick={()=>setCompareModal(sop)}>⇔ {de?"Vergleichen":"Compare"}</button>
                                  <button className="btn btn-b" style={{fontSize:"11px"}}>⬇ DOCX</button>
                                  <button className="btn btn-b" style={{fontSize:"11px",background:"#6b7280"}}>⬇ PDF</button>
                                  {canDo("docusign_send")&&(
                                    <button className="btn btn-p" style={{fontSize:"11px"}} onClick={()=>doDocuSign(sop.id,sop.title)}>
                                      ✉ DocuSign
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* FILE UPLOAD */}
                            <label className="upz">
                              📎 {de?"Datei zu diesem SOP hochladen (ZIP/DOCX/PDF)":"Upload file to this SOP (ZIP/DOCX/PDF)"}
                              <input type="file" style={{display:"none"}} onChange={e=>handleFileUpload(sop.id,e)} accept=".zip,.docx,.pdf,.xlsx"/>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── UPDATES ── */}
          {tab==="updates"&&(
            <div>
              <div className="sec-title">⚠ {de?"Rechtliche Aktualisierungen &#8212; 2026 Konformitaet":"Legal Updates Required &#8212; 2026 Compliance"}</div>
              <div className="sec-sub">{de?"KI-identifizierte rechtliche Aktualisierungen basierend auf MedCanG, AMG, PIC/S GMP, EU GDP, EU AI Act und Annex 11":"AI-identified legal updates based on MedCanG, AMG, PIC/S GMP, EU GDP, EU AI Act, and Annex 11"}</div>
              {LEGAL_UPDATES.map(u=>(
                <div key={u.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderLeft:`3px solid ${u.pri==="high"?"#dc2626":"#d97706"}`,borderRadius:8,padding:16,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:"#0a1628"}}>{u.title}</div>
                      <div style={{fontSize:12,color:"#1d4ed8",marginTop:2}}>{u.reg}</div>
                    </div>
                    <span className={`pri pri-${u.pri}`}>{u.pri.toUpperCase()}</span>
                  </div>
                  <div style={{fontSize:13,color:"#64748b"}}>{u.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── VERSIONS ── */}
          {tab==="versions"&&(
            <div>
              <div className="sec-title">📋 {de?"Versionskontrolle":"Version Control"}</div>
              <div className="card" style={{marginBottom:16}}>
                <div style={{fontWeight:600,color:"#0a1628",marginBottom:12,fontSize:14}}>🤖 {de?"KI-Agent Regulatorischer Rahmen:":"AI Agent Regulatory Framework:"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                  {[{n:"MedCanG",d:"§3-§25 + 2025"},{n:"AMG",d:"§13,§52a,§63a"},{n:"PIC/S GMP PE 009-17",d:"Ch1-9 + Annex 11"},{n:"EU GDP 2013/C 343/01",d:"Ch1-9"},{n:"BtMG/BtMBinHV",d:"Transitional"},{n:"EU AI Act 2024/1689",d:"Art.6-52 + Annex III"},{n:"21 CFR Part 11",d:"§11.10-§11.300"},{n:"Annex 11",d:"Electronic Records"}].map(r=>(
                    <div key={r.n} style={{padding:"11px 13px",border:"1px solid #e2e8f0",borderRadius:8}}>
                      <div style={{fontWeight:600,fontSize:12,color:"#0a1628"}}>{r.n}</div>
                      <div style={{fontSize:11,color:"#64748b",margin:"2px 0"}}>{r.d}</div>
                      <div style={{fontSize:12,color:"#059669",fontWeight:600}}>✅ Full</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{textAlign:"center",padding:40,color:"#64748b",fontSize:13}}>
                {de?"Noch keine Versionshistorie. KI-Agent verwenden, um SOPs zu generieren  -  jede Revision wird hier verfolgt.":"No version history yet. Use the AI Agent to generate SOPs  -  each revision is tracked here."}
              </div>
            </div>
          )}

          {/* ── SUGGEST ── */}
          {tab==="suggest"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                <div>
                  <div className="sec-title">💡 {de?"Vorgeschlagene neue SOPs &#8212; Regulatorische Lueckenanalyse":"Suggested New SOPs &#8212; Regulatory Gap Analysis"}</div>
                  <div className="sec-sub">{de?"KI-identifizierte SOPs basierend auf MedCanG, AMG, PIC/S GMP, EU GDP, EU AI Act und Annex 11":"AI-identified SOPs based on MedCanG, AMG, PIC/S GMP, EU GDP, EU AI Act, and Annex 11"}</div>
                </div>
                {canDo("generate_sop")&&<button className="btn btn-b">🚀 {de?"Alle generieren":"Generate All"} (20)</button>}
              </div>
              {[
                {id:"SOP-NEW-001",title:"MedCanG §4 Erlaubnis Compliance & Renewal",reg:"MedCanG §4, §7",pri:"high",owner:"RP",desc:"MedCanG §4 erfordert explizites BfArM Erlaubnismanagement. Keine bestehende SOP deckt Lizenzerneuerung, Bedingungsueberwachung oder Erlaubnisaenderungsverfahren ab. Erforderlich seit April 2024."},
                {id:"SOP-NEW-002",title:"MedCanG §10 Bestandsdokumentation Cannabis",reg:"MedCanG §10, §16(3)",pri:"high",owner:"RP/QP",desc:"MedCanG §10 schreibt kontinuierliche Lagerbestandsaufzeichnungen pro Produkt und Standort vor. §16(3) erfordert Jahresbericht an BfArM bis 31. Januar."},
                {id:"SOP-NEW-003",title:"MedCanG §12/§14 Import Genehmigung Procedure",reg:"MedCanG §12, §14",pri:"high",owner:"RP",desc:"Jeder Cannabisimport erfordert individuelle BfArM-Genehmigung. Kein SOP definiert Antragsworkflow, Zeitverfolgung oder Dokumentation fuer Import-/Exportgenehmigungen."},
                {id:"SOP-NEW-004",title:"Cannabis Product Labeling (MedCanG §21)",reg:"MedCanG §21, AMG §10",pri:"high",owner:"QA",desc:"MedCanG §21 legt spezifische Kennzeichnungsanforderungen fuer Cannabisprodukte fest. THC/CBD-Gehalt, Charge, Ablauf und MedCanG-Deklarationen muessen abgedeckt werden."},
              ].map(s=>(
                <div key={s.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderLeft:"3px solid #dc2626",borderRadius:8,padding:16,marginBottom:10}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:11,color:"#3b82f6",marginBottom:3}}>{s.id}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#0a1628"}}>{s.title}</div>
                    <span className="pri pri-high">HIGH</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{padding:"2px 8px",background:"#dbeafe",color:"#1d4ed8",borderRadius:10,fontSize:11}}>{s.reg}</span>
                    <span style={{padding:"2px 8px",background:"#dbeafe",color:"#1d4ed8",borderRadius:10,fontSize:11}}>{s.owner}</span>
                  </div>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:10}}>{s.desc}</div>
                  <div style={{display:"flex",gap:7}}>
                    {canDo("generate_sop")&&<button className="btn btn-b" style={{fontSize:12}}>🤖 {de?"SOP mit KI generieren":"Generate SOP with AI"}</button>}
                    <button className="btn btn-out" style={{fontSize:12}}>{de?"Zur Umsetzung vormerken":"Mark for Implementation"}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── VAULT ── */}
          {tab==="vault"&&(
            <div>
              <div className="sec-title">🗄 {de?"Dokumentenarchiv":"Document Vault"}</div>
              <div className="sec-sub">{de?"Abgeloeste & archivierte SOPs &#8212; automatisch archiviert bei Veroeffentlichung neuer Version":"Superseded & Archived SOPs"}</div>
              <div className="card" style={{textAlign:"center",padding:50,color:"#64748b",fontSize:13}}>
                {de?"Noch keine archivierten Dokumente. Beim Veroeffentlichen einer neuen SOP-Version wird die alte Version automatisch hier abgelegt.":"No archived documents yet. When you publish a new SOP version, the old version moves here automatically."}
              </div>
            </div>
          )}

          {/* ── SOP MATRIX ── */}
          {tab==="sopmatrix"&&(
            <div>
              <div className="sec-title">📊 SOP {de?"Masterliste & Regulatorische Matrix":"Master List & Regulatory Matrix"}</div>
              <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:10}}>
                <table className="mtbl">
                  <thead><tr>
                    <th>SOP-Nr.</th><th>Titel</th><th>Pri</th>
                    <th>MedCanG</th><th>AMG</th><th>PIC/S GMP</th><th>EU GDP</th><th>BtMG</th><th>EU AI Act</th><th>21 CFR Pt11</th><th>AMWHV</th>
                  </tr></thead>
                  <tbody>
                    {[
                      {id:"SOP-QMS-001",t:"Pharmazeutisches Qualitaetssystem",p:"HOCH",r:[1,1,1,1,0,1,1,1]},
                      {id:"SOP-QMS-002",t:"Dokumentenlenkung",p:"HOCH",r:[0,1,1,1,0,1,1,1]},
                      {id:"SOP-QMS-003",t:"Abweichungsmanagement",p:"HOCH",r:[0,1,1,1,0,1,0,1]},
                      {id:"SOP-QMS-004",t:"CAPA-Verfahren",p:"HOCH",r:[0,1,1,1,0,1,0,1]},
                      {id:"SOP-QMS-005",t:"Aenderungskontrolle",p:"HOCH",r:[0,1,1,1,0,1,1,1]},
                      {id:"SOP-QMS-006",t:"Interne Audits",p:"MITTEL",r:[0,1,1,1,0,1,0,1]},
                      {id:"SOP-QMS-007",t:"Management Review",p:"MITTEL",r:[0,0,1,1,0,1,0,1]},
                      {id:"SOP-QMS-008",t:"Reklamationsbearbeitung",p:"HOCH",r:[0,1,1,1,0,0,0,1]},
                      {id:"SOP-QMS-009",t:"Rueckrufverfahren",p:"HOCH",r:[0,1,1,1,0,0,0,0]},
                      {id:"SOP-QMS-010",t:"Lieferantenqualifizierung",p:"HOCH",r:[0,1,1,1,0,0,0,1]},
                      {id:"SOP-BTM-001",t:"BtM-Verkehr & Dokumentation",p:"HOCH",r:[1,1,1,0,1,0,0,1]},
                      {id:"SOP-BTM-006",t:"Cannabis-spezifische Herstellung",p:"HOCH",r:[1,1,1,0,1,1,0,1]},
                      {id:"SOP-AI-01",t:"Automated QC & Human Override",p:"HOCH",r:[0,0,1,0,0,1,0,0]},
                      {id:"SOP-CS-001",t:"Computerized Systems Validation",p:"HOCH",r:[0,1,1,0,0,1,1,0]},
                      {id:"SOP-MFG-001",t:"Herstellungsanweisung Allgemein",p:"HOCH",r:[1,1,1,0,0,1,0,1]},
                      {id:"SOP-MFG-005",t:"Chargenfreigabe",p:"HOCH",r:[1,1,1,0,0,1,1,0]},
                      {id:"SOP-GDP-001",t:"Lagerhaltung & Lagerbedingungen",p:"HOCH",r:[0,0,1,1,0,0,0,1]},
                      {id:"SOP-DOC-004",t:"Elektronische Signaturen",p:"HOCH",r:[0,1,1,0,0,1,1,0]},
                    ].map(row=>(
                      <tr key={row.id}>
                        <td>{row.id}</td><td>{row.t}</td>
                        <td><span className={`pri ${row.p==="HOCH"?"pri-high":"pri-medium"}`}>{row.p}</span></td>
                        {row.r.map((v,i)=><td key={i}><span style={{color:v?"#059669":"#e2e8f0",fontSize:13}}>{v?"✅":"-"}</span></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MATRIX ── */}
          {tab==="matrix"&&(
            <div>
              <div className="sec-title">🤖 {de?"KI-Verantwortungsmatrix":"AI Responsibility Matrix"}</div>
              {[{n:"COA Verification",t:"OCR/NLP",o:"RP",s:"SOP-AI-01",r:"HIGH"},{n:"BfArM Reporting",t:"Data Map",o:"IT",s:"SOP-IT-04",r:"MED"},{n:"Demand Forecast",t:"ML",o:"SCM",s:"SOP-WH-02",r:"LOW"},{n:"Pharmacy Validation",t:"Pattern",o:"Legal",s:"SOP-V-09",r:"HIGH"},{n:"Batch Release",t:"Decision",o:"QP",s:"SOP-AI-05",r:"HIGH"}].map(m=>(
                <div key={m.n} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#fff",border:"1px solid #e2e8f0",borderLeft:`3px solid ${m.r==="HIGH"?"#dc2626":m.r==="MED"?"#d97706":"#059669"}`,borderRadius:8,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#0a1628"}}>{m.n}</div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:3}}>AI Type: <strong>{m.t}</strong> · Owner: <strong>{m.o}</strong> · SOP: <span style={{color:"#1d4ed8",fontFamily:"var(--mono)"}}>{m.s}</span></div>
                  </div>
                  <span className={`pri pri-${m.r.toLowerCase()}`}>{m.r}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── HITL ── */}
          {tab==="hitl"&&(
            <div>
              <div className="sec-title">👤 {de?"Mensch-im-Regelkreis Entscheidungen":"Human-in-the-Loop Decisions"}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[{t:"Batch Release",s:de?"KI empfiehlt Freigabe":"AI recommends release"},{t:"Batch Recall",s:de?"Rueckrufsignal":"Lockdown signal"},{t:"COA Verify",s:"OCR parsed COA"},{t:"Pharmacy OK",s:de?"Apothekenverz. abgeglichen":"Apothekenverz. matched"},{t:"BfArM Submit",s:de?"Lagerbestandsexport":"Stock export"},{t:"Supplier Eval",s:"GMP signal"}].map(h=>(
                  <div key={h.t} className="card">
                    <div style={{fontSize:14,fontWeight:600,color:"#0a1628",marginBottom:4}}>{h.t}</div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:14}}>{h.s}</div>
                    <button className="btn btn-b" style={{width:"100%",fontSize:13}}>{de?"Entscheidungspanel oeffnen":"Open Decision Panel"}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AUDIT ── */}
          {tab==="audit"&&(
            <div>
              <div className="sec-title">✅ {de?"BfArM-Audit-Checkliste":"BfArM Audit Checklist"}</div>
              <div style={{marginBottom:14,fontSize:13,color:"#64748b"}}>{auditDone}/15 {de?"abgeschlossen":"completed"} · {de?"Klicken zum Abhaken":"Click to check off"}</div>
              {AUDIT_ITEMS.map(item=>{
                const done=auditChecked[item.id];
                return (
                  <div key={item.id} className={`ci ${done?"done":""}`}>
                    <div className={`cb ${done?"chk":""}`} onClick={()=>setAuditChecked(p=>({...p,[item.id]:!p[item.id]}))}>
                      {done&&"✓"}
                    </div>
                    <div style={{flex:1}}>
                      <div className={`ci-lbl ${done?"done":""}`}>{de?item.labelDe:item.label}</div>
                      <div className="ci-reg">{item.reg}</div>
                    </div>
                    <span className={`ci-sts ${done?"sts-d":"sts-p"}`}>{done?(de?"ERLEDIGT":"DONE"):(de?"AUSSTEHEND":"PENDING")}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LOG ── */}
          {tab==="log"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div className="sec-title">📋 {de?"Audit-Trail":"Audit Trail"} ({log.length} {de?"Eintraege":"entries"})</div>
                <button className="btn btn-out" style={{fontSize:12}}>📊 {de?"CSV exportieren":"Export CSV"}</button>
              </div>
              {log.map((e,i)=>(
                <div key={i} className="lrow">
                  <span className="ltime">{e.time}</span>
                  <span className={`lact la-${e.type}`}>{e.action}</span>
                  <span className="ltgt">{e.target}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── DOCUSIGN ── */}
          {tab==="docusign"&&(
            <div>
              <div className="sec-title">✉ DocuSign {de?"Signaturen":"Signatures"}</div>
              <div className="sec-sub">{de?"Elektronische Signaturen · 21 CFR Part 11 · EU Annex 11 §11 konform":"Electronic Signatures · 21 CFR Part 11 · EU Annex 11 §11 Compliant"}</div>
              {envelopes.length===0?(
                <div className="card" style={{textAlign:"center",padding:40,color:"#64748b"}}>
                  {de?"Keine Envelopes. Generieren Sie ein SOP und klicken Sie 'DocuSign'.":"No envelopes yet."}
                </div>
              ):envelopes.map(env=>(
                <div key={env.id} className="env-card">
                  <div className="env-hdr">
                    <div>
                      <div className="env-id">{env.id}</div>
                      <div className="env-title">{env.title}</div>
                      <div className="env-sop">{env.sop} · {de?"Gesendet":"Sent"}: {env.sent}</div>
                    </div>
                    {env.signers.every(s=>s.status==="signed")?
                      <span className="dbadge dbadge-act">✅ {de?"Vollstaendig signiert":"Fully Signed"}</span>:
                      <span className="dbadge dbadge-upd">⏳ {de?"Ausstehend":"Pending"}</span>
                    }
                  </div>
                  {env.signers.map((s,i)=>{
                    const cols={RP:"#3b82f6",QP:"#10b981",QA:"#f59e0b"};
                    return (
                      <div key={i} className="srow">
                        <div className="sav" style={{background:cols[s.role]||"#64748b"}}>{s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                        <div style={{flex:1}}>
                          <div className="s-name">{s.name}</div>
                          <div className="s-role">{s.role}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          {s.status==="signed"?<>
                            <span className="s-signed">✅ {de?"Signiert":"Signed"}</span>
                            {s.at&&<span className="s-date">{s.at}</span>}
                          </>:<>
                            <span className="s-await">⏳ {de?"Ausstehend":"Awaiting"}</span>
                            {(canDo("sign_approve")||canDo("final_approval"))&&(
                              <button className="btn btn-g" style={{fontSize:11,padding:"3px 9px"}} onClick={()=>setSignModal({sopId:env.sop,sopTitle:env.title})}>
                                🔏 {de?"Signieren":"Sign"}
                              </button>
                            )}
                          </>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ── BtM ── */}
          {tab==="btm"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                <div>
                  <div className="sec-title">⚖️ BtM {de?"Modul":"Module"}</div>
                  <div className="sec-sub">BtMG §§13-15 · BtMVV · MedCanG §10 · §16(3)</div>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <button className="btn btn-b" style={{fontSize:12}}>📊 {de?"Jahresbericht BfArM":"Annual BfArM Report"}</button>
                  <button className="btn btn-out" style={{fontSize:12}}>⬇ Excel</button>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table className="tbl">
                  <thead><tr>
                    <th>{de?"Substanz":"Substance"}</th>
                    <th>{de?"Interne Charge":"Internal Batch"}</th>
                    <th>{de?"Anfang (F)":"Opening (F)"}</th>
                    <th>{de?"Zugaenge (H)":"Receipts (H)"}</th>
                    <th>{de?"Abgaenge (J)":"Issues (J)"}</th>
                    <th>{de?"Schluss K=F+H-J":"Closing K=F+H-J"}</th>
                    <th>{de?"Koerperlich (L)":"Physical (L)"}</th>
                    <th>{de?"Differenz M=K-L":"Discrepancy M=K-L"}</th>
                    <th>{de?"Einheit":"Unit"}</th>
                    <th>Status</th>
                  </tr></thead>
                  <tbody>
                    {BtM_DATA.map((row,i)=>{
                      const K=row.opening+row.receipts-row.issues;
                      const M=K-row.physical;
                      const hasDisc=M!==0;
                      return (
                        <tr key={i} className={hasDisc?"btm-disc":""}>
                          <td style={{fontWeight:600,color:"#0a1628"}}>{row.substance}</td>
                          <td style={{fontFamily:"var(--mono)",fontSize:11}}>{row.batch}</td>
                          <td>{row.opening.toLocaleString()}</td>
                          <td style={{color:"#059669"}}>+{row.receipts.toLocaleString()}</td>
                          <td style={{color:"#dc2626"}}>-{row.issues.toLocaleString()}</td>
                          <td style={{fontWeight:600}}>{K.toLocaleString()}</td>
                          <td>{row.physical.toLocaleString()}</td>
                          <td>{hasDisc?<span className="disc-badge">⚠ {M>0?"+":""}{M}</span>:<span style={{color:"#059669",fontSize:12}}>✅ 0</span>}</td>
                          <td>{row.unit}</td>
                          <td>{hasDisc?<span className="dbadge dbadge-od" style={{fontSize:10}}>§15 BtMG</span>:<span className="dbadge dbadge-act">OK</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:10,fontSize:11,color:"#64748b"}}>K = F + H - J · M = K - L · §15 BtMG {de?"Untersuchung bei":"Investigation if"} M ≠ 0</div>
            </div>
          )}

          {/* ── GAMP5 ── */}
          
          {/* MATRIX 305 */}
          {tab==="matrix"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"#0a1628",marginBottom:2}}>SOP Matrix - Alle 305 Dokumente</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{de?"Regulatorische Abdeckung":"Regulatory coverage"}: 12 Frameworks</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input style={{padding:"7px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:12,width:140}} placeholder="SOP suchen..." value={matrixSearch} onChange={e=>setMatrixSearch(e.target.value)}/>
                  <select style={{padding:"7px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:12}} value={matrixFilter} onChange={e=>setMatrixFilter(e.target.value)}>
                    {SERIES_OPTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:10,maxHeight:"68vh",overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead style={{position:"sticky",top:0,zIndex:10}}>
                    <tr>
                      <th style={{padding:"8px 10px",background:"#0a1628",color:"#fff",fontSize:10,textAlign:"left",minWidth:110,fontWeight:600}}>SOP-Nr.</th>
                      <th style={{padding:"8px 10px",background:"#0a1628",color:"#fff",fontSize:10,textAlign:"left",minWidth:170,fontWeight:600}}>Titel</th>
                      <th style={{padding:"8px 6px",background:"#0a1628",color:"#fff",fontSize:10,minWidth:35,fontWeight:600}}>%</th>
                      {REG_COLS.map(c=>(
                        <th key={c.k} style={{padding:"8px 6px",background:"#0a1628",color:"#fff",fontSize:10,textAlign:"center",minWidth:44,fontWeight:600,whiteSpace:"nowrap"}}>{c.l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_SOPS.filter(s=>(matrixFilter==="All"||s.series===matrixFilter)&&(!matrixSearch||s.id.toLowerCase().includes(matrixSearch.toLowerCase())||s.title.toLowerCase().includes(matrixSearch.toLowerCase()))).map(sop=>{
                      const regs=SERIES_REGS[sop.series]||{};
                      const covered=REG_COLS.filter(c=>regs[c.k]).length;
                      return (
                        <tr key={sop.id} style={{background:sop.overdue?"#fff5f5":"#fff"}}>
                          <td style={{padding:"6px 10px",fontFamily:"var(--mono)",fontSize:10,color:"#1d4ed8",borderBottom:"1px solid #f1f5f9",whiteSpace:"nowrap"}}>{sop.id}</td>
                          <td style={{padding:"6px 10px",fontSize:11,color:"#334155",borderBottom:"1px solid #f1f5f9",maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sop.title}</td>
                          <td style={{padding:"6px 6px",borderBottom:"1px solid #f1f5f9",textAlign:"center"}}>
                            <div style={{width:30,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto"}}>
                              <div style={{width:sop.progress+"%",height:"100%",background:"#1d4ed8",borderRadius:2}}/>
                            </div>
                          </td>
                          {REG_COLS.map(c=>(
                            <td key={c.k} style={{padding:"6px 6px",borderBottom:"1px solid #f1f5f9",textAlign:"center",background:regs[c.k]?"#f0fdf4":"#fff"}}>
                              {regs[c.k]?<span style={{color:"#059669",fontSize:13,fontWeight:700}}>Y</span>:<span style={{color:"#e2e8f0",fontSize:10}}>-</span>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:8,fontSize:11,color:"#64748b"}}>
                {ALL_SOPS.filter(s=>matrixFilter==="All"||s.series===matrixFilter).length} Dokumente - Y = anwendbar - ROT = ueberfaellig
              </div>
            </div>
          )}

          {/* TRAINING TRACKER */}
          {tab==="training"&&(
            <div>
              <div style={{fontSize:17,fontWeight:700,color:"#0a1628",marginBottom:2}}>Schulungsmatrix</div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>{TRAINEES.length} Personen x {TRAINING_SOPS.length} SOPs - Klick zum Aendern</div>
              <div style={{overflowX:"auto",marginBottom:16,border:"1px solid #e2e8f0",borderRadius:8}}>
                <table style={{borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr>
                      <th style={{padding:"10px 14px",background:"#0a1628",color:"#fff",fontSize:11,fontWeight:600,textAlign:"left",minWidth:160,position:"sticky",left:0,zIndex:5}}>Person</th>
                      {TRAINING_SOPS.map(sid=>(
                        <th key={sid} style={{padding:"4px 6px",background:"#0a1628",color:"#94a3b8",fontSize:9,fontWeight:600,textAlign:"center",minWidth:42,maxWidth:42,writingMode:"vertical-rl",transform:"rotate(180deg)",height:80,whiteSpace:"nowrap"}}>{sid.replace(/SOP-/,"")}</th>
                      ))}
                      <th style={{padding:"10px 8px",background:"#0a1628",color:"#fff",fontSize:10,textAlign:"center",minWidth:60}}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRAINEES.map(person=>{
                      const done=TRAINING_SOPS.filter(sid=>trainingState[person.id+"_"+sid]==="done").length;
                      return (
                        <tr key={person.id}>
                          <td style={{padding:"8px 14px",background:"#fff",borderBottom:"1px solid #f1f5f9",position:"sticky",left:0,zIndex:3,borderRight:"2px solid #e2e8f0"}}>
                            <div style={{fontWeight:600,fontSize:12,color:"#0a1628"}}>{person.name}</div>
                            <div style={{fontSize:10,color:"#64748b"}}>{person.role}</div>
                          </td>
                          {TRAINING_SOPS.map(sid=>{
                            const st=trainingState[person.id+"_"+sid]||"none";
                            return (
                              <td key={sid} style={{padding:"6px",borderBottom:"1px solid #f1f5f9",textAlign:"center",cursor:"pointer",background:st==="done"?"#f0fdf4":st==="due"?"#fefce8":"#fff"}}
                                onClick={()=>setTrainingState(p=>{
                                  const k=person.id+"_"+sid;
                                  return {...p,[k]:p[k]==="done"?"due":p[k]==="due"?"none":"done"};
                                })}>
                                <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid "+(st==="done"?"#059669":st==="due"?"#d97706":"#cbd5e1"),background:st==="done"?"#059669":st==="due"?"#d97706":"transparent",margin:"0 auto"}}/>
                              </td>
                            );
                          })}
                          <td style={{padding:"8px",borderBottom:"1px solid #f1f5f9",textAlign:"center",background:"#f8fafc"}}>
                            <span style={{fontSize:12,fontWeight:700,color:done===TRAINING_SOPS.length?"#059669":done>0?"#d97706":"#dc2626"}}>{done}/{TRAINING_SOPS.length}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{display:"flex",gap:14,fontSize:12,color:"#64748b",marginBottom:12}}>
                <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"#059669",marginRight:5,verticalAlign:"middle"}}/>Abgeschlossen</span>
                <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"#d97706",marginRight:5,verticalAlign:"middle"}}/>Faellig</span>
                <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",border:"2px solid #cbd5e1",marginRight:5,verticalAlign:"middle"}}/>Ausstehend</span>
              </div>
              {canDo("generate_sop")&&(
                <button style={{padding:"11px 20px",background:"#059669",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"}}
                  onClick={()=>addLog("TRAINING_EXPORT","Schulungsnachweis PDF generiert","done")}>
                  Schulungsnachweis PDF generieren
                </button>
              )}
            </div>
          )}

          {/* MANDATORY SOPs */}
          {tab==="mandatory"&&(
            <div>
              <div style={{fontSize:17,fontWeight:700,color:"#0a1628",marginBottom:2}}>Pflicht-SOPs fuer BfArM-Betrieb</div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:14}}>BtMG, AMG, MedCanG, EU GMP - ohne diese darf nicht operiert werden</div>
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:14,fontWeight:700,color:"#991b1b"}}>{Object.values(mandatoryChecked).filter(Boolean).length}/{MANDATORY_SOPS.length} nachgewiesen</span>
                <span style={{fontSize:12,color:"#dc2626"}}>{MANDATORY_SOPS.length-Object.values(mandatoryChecked).filter(Boolean).length} ausstehend - BfArM-Audit-Risiko</span>
              </div>
              {MANDATORY_SOPS.map(m=>{
                const hasFile=!!uploadedFiles[m.id];
                const isGenerated=!!generated[m.id];
                const done=mandatoryChecked[m.id];
                const sop=ALL_SOPS.find(s=>s.id===m.id);
                return (
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":m.critical?"#fecaca":"#e2e8f0"),borderLeft:"3px solid "+(m.critical?"#dc2626":"#d97706"),borderRadius:8,marginBottom:6,flexWrap:"wrap"}}>
                    <div style={{width:22,height:22,borderRadius:5,border:"2px solid "+(done?"#059669":"#cbd5e1"),background:done?"#059669":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontSize:13,fontWeight:700}}
                      onClick={()=>setMandatoryChecked(p=>({...p,[m.id]:!p[m.id]}))}>
                      {done&&"v"}
                    </div>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0a1628"}}>{m.id}</div>
                      <div style={{fontSize:12,color:"#64748b"}}>{m.title}</div>
                      <div style={{fontSize:11,color:"#1d4ed8",marginTop:1}}>{m.law}</div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      {m.critical&&<span style={{padding:"2px 7px",background:"#fee2e2",color:"#991b1b",borderRadius:8,fontSize:10,fontWeight:700}}>KRITISCH</span>}
                      {hasFile||isGenerated?<span style={{padding:"2px 7px",background:"#d1fae5",color:"#065f46",borderRadius:8,fontSize:10,fontWeight:700}}>OK</span>:<span style={{padding:"2px 7px",background:"#fef3c7",color:"#92400e",borderRadius:8,fontSize:10,fontWeight:700}}>FEHLT</span>}
                      {sop&&<span style={{fontSize:11,color:"#64748b"}}>{sop.progress}%</span>}
                    </div>
                    {!hasFile&&!isGenerated&&canDo("generate_sop")&&(
                      <button style={{padding:"5px 11px",background:"#059669",color:"#fff",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"}}
                        onClick={()=>doGenerate(m.id)}>KI-Erstversion</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CYBERSECURITY */}
          {tab==="cyber"&&(
            <div>
              <div style={{fontSize:17,fontWeight:700,color:"#0a1628",marginBottom:2}}>Cybersicherheits-Kontrollen</div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:14}}>NIS2 Art.21 - BSI IT-Grundschutz 200-1 - ISO 27001:2022 - GMP Annex 11</div>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                {[["NIS2","#dbeafe","#1d4ed8"],["BSI","#ede9fe","#6d28d9"],["ISO27001","#d1fae5","#065f46"],["GMP","#fef3c7","#92400e"]].map(([cat,bg,col])=>(
                  <div key={cat} style={{padding:"8px 14px",background:bg,color:col,borderRadius:8,fontSize:13,fontWeight:700}}>
                    {cat}: {CYBER_CONTROLS.filter(c=>c.cat===cat&&cyberChecked[c.id]).length}/{CYBER_CONTROLS.filter(c=>c.cat===cat).length}
                  </div>
                ))}
              </div>
              {CYBER_CONTROLS.map(cc=>{
                const done=cyberChecked[cc.id];
                const catStyle={NIS2:["#dbeafe","#1d4ed8"],BSI:["#ede9fe","#6d28d9"],ISO27001:["#d1fae5","#065f46"],GMP:["#fef3c7","#92400e"]};
                const [bg,col]=(catStyle[cc.cat])||["#f1f5f9","#64748b"];
                return (
                  <div key={cc.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":"#e2e8f0"),borderRadius:8,marginBottom:5}}>
                    <div style={{width:22,height:22,borderRadius:5,border:"2px solid "+(done?"#059669":"#cbd5e1"),background:done?"#059669":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,flexShrink:0}}
                      onClick={()=>setCyberChecked(p=>({...p,[cc.id]:!p[cc.id]}))}>
                      {done&&"v"}
                    </div>
                    <span style={{padding:"2px 8px",background:bg,color:col,borderRadius:5,fontSize:10,fontWeight:700,minWidth:60,textAlign:"center"}}>{cc.cat}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#0a1628"}}>{cc.title}</div>
                      <div style={{fontSize:11,color:"#1d4ed8"}}>{cc.ref}</div>
                    </div>
                    <span style={{padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,background:done?"#d1fae5":"#fef3c7",color:done?"#065f46":"#92400e"}}>{done?"OK":"OFFEN"}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* IMPORT FORMULAR */}
          {tab==="import"&&(
            <div>
              <div style={{fontSize:17,fontWeight:700,color:"#0a1628",marginBottom:2}}>BtM Import-Formular</div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>BtMG §14 - BtMVV - MedCanG §12 - Einfuhrerlaubnis BfArM</div>
              {importSubmitted?(
                <div style={{textAlign:"center",padding:40,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12}}>
                  <div style={{fontSize:40,marginBottom:12}}>OK</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#065f46",marginBottom:6}}>Import erfolgreich eingereicht</div>
                  <div style={{fontSize:13,color:"#059669"}}>Audit-Trail-Eintrag erstellt - BtM-Inventar aktualisiert</div>
                </div>
              ):(
                <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:20}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                    {IMPORT_FIELDS.map(f=>(
                      <div key={f.k} style={{display:"flex",flexDirection:"column",gap:5}}>
                        <label style={{fontSize:12,fontWeight:600,color:"#334155"}}>
                          {f.l}{f.req&&<span style={{color:"#dc2626"}}> *</span>}
                        </label>
                        <input
                          style={{padding:"9px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,fontFamily:"var(--font)"}}
                          placeholder={f.req?"Pflichtfeld...":"Optional..."}
                          value={importForm[f.k]||""}
                          onChange={e=>setImportForm(p=>({...p,[f.k]:e.target.value}))}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:7,padding:"10px 14px",fontSize:12,color:"#78350f",marginBottom:16}}>
                    Dieses Formular wird gemaess BtMG §15 und Annex 11 §9 im unveraenderlichen Audit-Trail protokolliert.
                    RP-Unterschrift und QP-Gegenpruefung erforderlich.
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    {canDo("import_filing")&&(
                      <button style={{padding:"12px 24px",background:"#059669",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"var(--font)"}}
                        onClick={()=>{
                          const req=IMPORT_FIELDS.filter(f=>f.req&&!importForm[f.k]);
                          if(req.length>0){alert("Pflichtfelder fehlen: "+req.map(f=>f.l).join(", "));return;}
                          setImportSubmitted(true);
                          addLog("IMPORT_FILED",(importForm.permitNo||"?")+": "+(importForm.substance||"?")+" "+(importForm.quantity||"?")+(importForm.unit||""),"done");
                          setTimeout(()=>{setImportSubmitted(false);setImportForm({});},3000);
                        }}>
                        Import einreichen
                      </button>
                    )}
                    <button style={{padding:"12px 20px",background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}
                      onClick={()=>setImportForm({})}>Zuruecksetzen</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==="validation"&&(
            <div>
              <div className="sec-title">📋 GAMP5 {de?"Validierungspaket":"Validation Package"}</div>
              <div className="sec-sub">IQ · OQ · PQ · {de?"GxP-Nutzung genehmigt":"Approved for GxP Use"}</div>
              <div className="val-ok"><span style={{fontSize:20}}>✅</span> {de?"Alle 18 Tests bestanden · System fuer GxP-Nutzung zugelassen · GAMP5 Kat. 4":"All 18 tests passed · System approved for GxP use · GAMP5 Cat. 4"}</div>
              {Object.values(VALIDATION_DOCS).map(doc=>(
                <div key={doc.code} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:"#0a1628"}}>{doc.title}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:11,color:"#64748b"}}>{doc.code}</div>
                      <div style={{fontSize:12,color:"#1d4ed8"}}>{doc.std}</div>
                    </div>
                    <button className="btn btn-b" style={{fontSize:12}}>⬇ PDF</button>
                  </div>
                  {doc.tests.map(t=>(
                    <div key={t.id} className="test-row">
                      <div className="tpass">✓</div>
                      <span className="tid">{t.id}</span>
                      <span className="tname">{t.name}</span>
                      <span className="tdate">{t.date}</span>
                      <span className="dbadge dbadge-act">PASSED</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── USERS ── */}
          {tab==="users"&&(
            <div>
              <div className="sec-title">👥 {de?"Benutzerverwaltung":"User Management"}</div>
              <div className="sec-sub">{de?"Rollenbasierte Zugriffskontrolle · Annex 11 §12 · 21 CFR Part 11 §11.10(g)":"Role-Based Access Control · Annex 11 §12 · 21 CFR Part 11 §11.10(g)"}</div>
              {Object.entries(USERS).map(([email,u])=>(
                <div key={email} className="ucard">
                  <div className="uav" style={{background:u.color}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                  <div style={{flex:1}}>
                    <div className="ui-name">{u.name}</div>
                    <div className="ui-email">{email}</div>
                    <div className="ui-role">{u.roleLabel}</div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#64748b",marginBottom:5,textTransform:"uppercase",fontWeight:600,letterSpacing:".05em"}}>{de?"Berechtigungen":"Permissions"}</div>
                    <div className="ptags">{u.permissions.map(p=><span key={p} className="ptag">{p}</span>)}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span className="dbadge" style={{background:email===user?.email?"#d1fae5":"#f1f5f9",color:email===user?.email?"#065f46":"#64748b",padding:"4px 8px"}}>{email===user?.email?"● Online":"○ Offline"}</span>
                    <span className="dbadge dbadge-orig" style={{padding:"4px 8px"}}>{u.role}</span>
                  </div>
                </div>
              ))}
              <div className="card" style={{marginTop:18,background:"#fffbeb",border:"1px solid #fde68a"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#92400e",marginBottom:7}}>⚠ Annex 11 §12 {de?"Anforderungen":"Requirements"}</div>
                <div style={{fontSize:12,color:"#78350f",lineHeight:1.7}}>
                  ✅ {de?"Eindeutige Benutzer-IDs &#8212; keine gemeinsamen Anmeldungen":"Unique user IDs &#8212; no shared logins"}<br/>
                  ✅ {de?"Rollenberechtigungen serverseitig durchgesetzt":"Role permissions enforced server-side"}<br/>
                  ✅ {de?"Zugangssperrverfahren dokumentiert":"Access revocation procedure documented"}<br/>
                  ✅ {de?"Benutzer-Zugriffsprotokoll im Audit-Trail":"User access log in audit trail"}<br/>
                  ✅ {de?"Sitzungs-Timeout 30 Minuten":"Session timeout 30 minutes"}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="footer">
          NOC Pharma GmbH · Murchin, MV · {de?"Dieses System entspricht AMG, BtMG und EU GMP · Annex 11":"This system complies with AMG, BtMG, and EU GMP · Annex 11"}<br/>
          RP: C. Hamelink | QP: T. Cuny | QA: Dr. O. Schagon | {new Date().toLocaleDateString("de-DE")} · {de?"305 Dokumente geladen":"305 documents loaded"}
        </div>
      </div>

      {/* ── ZIP UPLOAD MODAL ── */}
      {zipModal&&(
        <div className="overlay" onClick={()=>!zipProcessing&&setZipModal(false)}>
          <div className="mcard" style={{width:560}} onClick={e=>e.stopPropagation()}>
            {zipProcessing?(
              <div style={{textAlign:"center",padding:"32px 0"}}>
                <div style={{fontSize:40,marginBottom:16}}>📦</div>
                <div style={{fontSize:16,fontWeight:700,color:"#0a1628",marginBottom:8}}>
                  {de?"ZIP wird verarbeitet...":"Processing ZIP..."}
                </div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
                  {de?"Dateien werden erkannt und SOPs zugeordnet":"Detecting files and matching to SOPs"}
                </div>
                <div style={{width:"100%",height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:"70%",height:"100%",background:"#1d4ed8",borderRadius:3,animation:"none"}}/>
                </div>
              </div>
            ):zipResult&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div className="mtitle">📦 ZIP {de?"Upload abgeschlossen":"Upload Complete"}</div>
                  <button className="btn btn-out" style={{fontSize:12}} onClick={()=>setZipModal(false)}>✕ {de?"Schliessen":"Close"}</button>
                </div>
                <div className="zip-stats">
                  <div className="zip-stat" style={{background:"#f0fdf4"}}>
                    <div className="zip-stat-val" style={{color:"#059669"}}>{zipResult.matched}</div>
                    <div className="zip-stat-lbl">✅ {de?"Zugeordnet":"Matched"}</div>
                  </div>
                  <div className="zip-stat" style={{background:"#fef2f2"}}>
                    <div className="zip-stat-val" style={{color:"#dc2626"}}>{zipResult.unmatched}</div>
                    <div className="zip-stat-lbl">⚠ {de?"Nicht zugeordnet":"Unmatched"}</div>
                  </div>
                  <div className="zip-stat" style={{background:"#eff6ff"}}>
                    <div className="zip-stat-val" style={{color:"#1d4ed8"}}>{zipResult.total}</div>
                    <div className="zip-stat-lbl">📄 {de?"Gesamt":"Total"}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600}}>
                  {de?"Originalversionen gespeichert  -  fuer alle zugeordneten SOPs verfuegbar (📄 Vorschau im Dokument-Expand)":
                     "Original versions saved  -  available for all matched SOPs (📄 Preview in doc expand)"}
                </div>
                <div className="zip-file-list">
                  {zipResult.files.slice(0,40).map((f,i)=>(
                    <div key={i} className={`zip-file-row ${f.matched?"matched":"unmatched"}`}>
                      <span style={{fontSize:14}}>{f.matched?"📄":"⚠"}</span>
                      <span className="zip-file-name">{f.filename}</span>
                      {f.matched
                        ? <span className="zip-file-match">→ {f.matchedId}</span>
                        : <span className="zip-file-nomatch">{de?"Kein Treffer":"No match"}</span>
                      }
                    </div>
                  ))}
                  {zipResult.files.length>40&&(
                    <div style={{padding:"8px 12px",fontSize:11,color:"#64748b",textAlign:"center"}}>
                      ... {zipResult.files.length-40} {de?"weitere Dateien":"more files"}
                    </div>
                  )}
                </div>
                <div style={{marginTop:14,display:"flex",gap:8}}>
                  <button className="btn btn-g" style={{flex:1,padding:11,fontSize:13}} onClick={()=>setZipModal(false)}>
                    ✅ {de?"Fertig  -  Dokumente anzeigen":"Done  -  View Documents"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {signModal&&(
        <div className="overlay" onClick={()=>!signDone&&(setSignModal(null),setSignPwd(""),setSignDone(false))}>
          <div className="mcard" onClick={e=>e.stopPropagation()}>
            {signDone?(
              <div className="signed-ok">
                <div className="ic">✅</div>
                <p>{de?"Signatur aufgezeichnet":"Signature recorded"}</p>
                <div style={{fontSize:12,color:"#64748b",marginTop:7}}>{user.name} · {user.roleLabel} · {new Date().toLocaleString("de-DE")}</div>
              </div>
            ):(
              <>
                <div className="mtitle">🔏 {de?"Dokument elektronisch signieren":"Sign Document Electronically"}</div>
                <div className="msub">{signModal.sopId}</div>
                <div className="m-stmt">
                  {de?"GMP-Konformitaetsbestaetigung gemaess Annex 11 und 21 CFR Part 11":"GMP compliance confirmation per Annex 11 and 21 CFR Part 11"}
                </div>
                <div className="m-signer">
                  <div className="uav" style={{background:user.color,width:36,height:36,borderRadius:8,flexShrink:0}}>{user.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#0a1628"}}>{user.name}</div>
                    <div style={{fontSize:12,color:"#64748b"}}>{user.roleLabel}</div>
                  </div>
                </div>
                <div className="fgrp">
                  <label className="flbl" style={{color:"#334155"}}>{de?"Passwort zur Bestaetigung erneut eingeben":"Re-enter password to confirm"}</label>
                  <input className="finp finp-light" type="password" value={signPwd} onChange={e=>setSignPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSign()} placeholder="••••••••"/>
                </div>
                <div className="m-acts">
                  <button className="sign-ok" onClick={doSign}>{de?"Signatur bestaetigen":"Confirm Signature"}</button>
                  <button className="sign-no" onClick={()=>{setSignModal(null);setSignPwd("");setSignDone(false);}}>{de?"Abbrechen":"Cancel"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── COMPARE MODAL ── */}
      {compareModal&&(
        <div className="overlay" onClick={()=>setCompareModal(null)}>
          <div className="mcard wide" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div className="mtitle">⇔ {de?"Vergleichen":"Compare"}: {compareModal.id}</div>
                <div style={{fontSize:12,color:"#64748b"}}>v1.0 (Legacy) → v2.0 ({de?"KI-Vorschlag":"AI Proposed"})</div>
              </div>
              <div style={{display:"flex",gap:7}}>
                {canDo("send_to_qp")&&<button className="btn btn-g" style={{fontSize:12}}>📤 {de?"An RP-Pruefung senden":"Submit for RP Review"}</button>}
                <button className="btn btn-out" style={{fontSize:12}} onClick={()=>setCompareModal(null)}>✕ {de?"Schliessen":"Close"}</button>
              </div>
            </div>
            <div className="compare-grid">
              <div className="cside">
                <div className="cside-hdr leg">🗂 LEGACY &#8212; v1.0 ({de?"Ueberholt":"Superseded"})</div>
                <div className="cside-body" style={{background:"#fff5f5"}}>
                  {ORIGINAL_VERSIONS[compareModal.id]?(
                    <pre style={{fontFamily:"var(--mono)",fontSize:11,whiteSpace:"pre-wrap",color:"#6b7280"}}>
                      {ORIGINAL_VERSIONS[compareModal.id].preview}
                    </pre>
                  ):(
                    <span style={{color:"#9ca3af",fontStyle:"italic"}}>
                      [{de?"Originaldokument nicht verfuegbar  -  ZIP hochladen zum Vergleichen":"Original document not available  -  upload ZIP to compare"}]
                    </span>
                  )}
                </div>
              </div>
              <div className="cside">
                <div className="cside-hdr nw">✨ NEU &#8212; v2.0 ({de?"KI-Vorschlag":"AI Proposed"})</div>
                <div className="cside-body">
                  <p><strong># {compareModal.id} &#8212; {compareModal.title}</strong></p>
                  <p><strong>Version:</strong> 2.0 | <strong>Datum:</strong> {new Date().toLocaleDateString("de-DE")}</p>
                  <p><strong>NOC Pharma GmbH, Murchin, Mecklenburg-Vorpommern</strong></p>
                  <p>---</p>
                  <p><strong>## 1. Zweck</strong></p>
                  <p className="hl">Diese SAW definiert die Verfahren bei NOC Pharma GmbH gemaess §52a AMG, §7 MedCanG sowie PIC/S GMP PE 009-17 Kapitel 4. <strong>[NEU 2026]</strong> Integration von KI-unterstuetzten Dokumentationsprozessen gemaess EU AI Act Art.6 und Annex III sowie Sicherstellung der Datenintegritaet nach PIC/S GMP Annex 11 §4-9.</p>
                  <p><strong>## 2. Geltungsbereich</strong></p>
                  <p>Diese SOP gilt fuer alle qualitaetsrelevanten Dokumente der NOC Pharma GmbH.</p>
                  <p className="hl"><strong>[NEU 2026]</strong> KI-generierte Dokumentationsinhalte und HITL Override-Dokumentation eingeschlossen.</p>
                  <p><strong>## 3. Abkuerzungen</strong></p>
                  <p><strong>AMG:</strong> Arzneimittelgesetz · <strong>GDP:</strong> Good Distribution Practice · <strong>GMP:</strong> Good Manufacturing Practice</p>
                  <p className="hl"><strong>HITL:</strong> Human-in-the-Loop [NEU 2026] · <strong>MedCanG:</strong> Medizinal-Cannabisgesetz</p>
                </div>
              </div>
            </div>
            <div style={{marginTop:10,fontSize:11,color:"#64748b"}}>
              {de?"Signatare:":"Signatories:"} Celso Hamelink Chmielewski (RP) · Torsten Cuny (QP) · Dr. Olaf Schagon (QA) | {de?"Dieses Dokument entspricht AMG, BtMG und EU GMP":"This document complies with AMG, BtMG, and EU GMP"} · EU GMP Kap.4
            </div>
          </div>
        </div>
      )}
    </>
  );
}
