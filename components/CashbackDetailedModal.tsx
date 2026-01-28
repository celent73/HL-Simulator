import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, RefreshCw, ShoppingBag, Car, ShoppingCart, Gift, Plane, Home, BookOpen, Coffee, Check, Trash2, PlusCircle, RotateCcw, RotateCw } from 'lucide-react';

import { CashbackCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';




interface CashbackDetailedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (totalSpending: number, totalCashback: number, details: CashbackCategory[]) => void;
    initialDetails?: CashbackCategory[];
}

const getIcon = (name: string) => {
    switch (name) {
        case 'ShoppingBag': return <ShoppingBag size={20} />;
        case 'Car': return <Car size={20} />;
        case 'ShoppingCart': return <ShoppingCart size={20} />;
        case 'Gift': return <Gift size={20} />;
        case 'Plane': return <Plane size={20} />;
        case 'Home': return <Home size={20} />;
        case 'BookOpen': return <BookOpen size={20} />;
        default: return <Coffee size={20} />;
    }
};

// List of available brands with cashback percentages
// List of available brands with cashback percentages and categories
const BRANDS_DATA = [
    // ALIMENTARI
    { name: 'Conad', percentage: 1.69, categories: ['alim'] },
    { name: 'Carrefour', percentage: 2.25, categories: ['alim'] },
    { name: 'Penny.', percentage: 3.38, categories: ['alim', 'md'] },
    { name: 'Bennet', percentage: 3.38, categories: ['alim'] },
    { name: 'ALI\'', percentage: 2.63, categories: ['alim'] },
    { name: 'Iper La grande i', percentage: 3.00, categories: ['alim'] },
    { name: 'Unes', percentage: 2.63, categories: ['alim'] },
    { name: 'Pam Panorama', percentage: 2.25, categories: ['alim'] },
    { name: 'Despar Nordest', percentage: 2.25, categories: ['alim'] },
    { name: 'Iperal', percentage: 2.25, categories: ['alim'] },
    { name: 'Mercatò', percentage: 2.25, categories: ['alim'] },
    { name: 'Unicomm', percentage: 2.25, categories: ['alim'] },
    { name: 'MAXI DI', percentage: 2.25, categories: ['alim'] },
    { name: 'Il Gigante', percentage: 2.25, categories: ['alim'] },
    { name: 'BASKO', percentage: 2.78, categories: ['alim'] },
    { name: 'Deco', percentage: 3.75, categories: ['alim'] },
    { name: 'SuperConveniente', percentage: 3.75, categories: ['alim'] },
    { name: 'Megamark', percentage: 3.00, categories: ['alim'] },
    { name: 'Martinelli Supermercati', percentage: 2.25, categories: ['alim'] },
    { name: 'Eataly', percentage: 3.38, categories: ['alim', 'regali'] },
    { name: 'Italmark', percentage: 2.25, categories: ['alim'] },
    { name: 'Migross', percentage: 2.25, categories: ['alim'] },
    { name: 'Iper Tosano', percentage: 2.25, categories: ['alim'] },
    { name: 'Rossetto', percentage: 2.25, categories: ['alim'] },
    { name: 'EKOM', percentage: 2.78, categories: ['alim', 'md'] },
    { name: 'MD', percentage: 1.95, categories: ['alim', 'md'] },
    { name: 'Todis', percentage: 1.88, categories: ['alim'] },
    { name: 'Eurospin', percentage: 0.5, categories: ['alim'] },


    // CARBURANTE
    { name: 'Tamoil', percentage: 1.88, categories: ['carb'] },
    { name: 'Q8', percentage: 1.88, categories: ['carb'] },
    { name: 'IP', percentage: 1.88, categories: ['carb'] },
    { name: 'Buono Enilive Digitale', percentage: 1.88, categories: ['carb'] },
    { name: 'Buono Enilive Servito Digitale', percentage: 2.25, categories: ['carb'] },

    // IGIENE PERSONAL
    { name: 'Tigotà', percentage: 4.13, categories: ['igiene', 'casa'] },
    { name: 'Acqua & Sapone', percentage: 3.38, categories: ['igiene', 'casa'] },
    { name: 'Douglas', percentage: 4.13, categories: ['igiene', 'regali'] },
    { name: 'Sephora', percentage: 4.13, categories: ['igiene', 'regali'] },
    { name: 'Marionnaud Paris', percentage: 4.87, categories: ['igiene', 'regali'] },
    { name: 'Bottega Verde', percentage: 3.38, categories: ['igiene', 'regali'] },
    { name: 'L\'ERBOLARIO', percentage: 3.00, categories: ['igiene', 'regali'] },
    { name: 'Rituals', percentage: 6.38, categories: ['igiene', 'regali'] },
    { name: 'EsserBella Profumerie', percentage: 3.75, categories: ['igiene', 'regali'] },

    // JOLLY (Valid for almost everything)
    { name: 'Amazon.it', percentage: 1.88, categories: ['alim', 'igiene', 'abb', 'regali', 'casa', 'school', 'md'] },
    { name: 'ideaShopping', percentage: 1.88, categories: ['alim', 'igiene', 'abb', 'regali', 'casa', 'school', 'md', 'treni'] },

    // TRASPORTI
    { name: 'Trenitalia', percentage: 3.38, categories: ['treni', 'regali'] },
    { name: 'Italo', percentage: 2.78, categories: ['treni', 'regali'] },
    { name: 'FlixBus', percentage: 3.75, categories: ['treni', 'regali'] },
    { name: 'ITA AIRWAYS', percentage: 3.38, categories: ['treni', 'regali'] },
    { name: 'UBER', percentage: 2.40, categories: ['treni'] },
    { name: 'Volagratis', percentage: 6.00, categories: ['treni', 'regali'] },
    { name: 'IBERIA LÍNEAS AÉREAS', percentage: 3.75, categories: ['treni'] },
    { name: 'Airbnb', percentage: 3.00, categories: ['treni', 'regali'] },
    { name: 'Booking.com', percentage: 3.00, categories: ['treni', 'regali'] },

    // ABBIGLIAMENTO
    { name: 'OVS', percentage: 5.63, categories: ['abb', 'regali'] },
    { name: 'Zalando', percentage: 5.63, categories: ['abb', 'regali'] },
    { name: 'H&M', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Primark', percentage: 3.75, categories: ['abb', 'regali'] },
    { name: 'Tezenis', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Terranova', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'PittaRosso', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'Intimissimi', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Scarpe&Scarpe', percentage: 2.63, categories: ['abb', 'regali'] },
    { name: 'Calzedonia', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Nike', percentage: 3.00, categories: ['abb', 'regali'] },
    { name: 'Guess', percentage: 4.13, categories: ['abb', 'regali'] },
    { name: 'Foot Locker', percentage: 6.00, categories: ['abb', 'regali'] },
    { name: 'Calliope', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Doppelganger', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Rinascimento', percentage: 3.75, categories: ['abb', 'regali'] },
    { name: 'Asos', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Falconeri', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Chicco', percentage: 4.88, categories: ['abb', 'regali', 'school'] },
    { name: 'Du Pareil Au Meme', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'Coccinelle', percentage: 3.00, categories: ['abb', 'regali'] },
    { name: 'Ray-Ban', percentage: 4.13, categories: ['abb', 'regali'] },
    { name: 'Coin', percentage: 4.50, categories: ['abb', 'regali', 'casa'] },

    // ELETTRONICA & CASA & SCHOOL & REGALI (Misti)
    { name: 'MediaWorld', percentage: 1.88, categories: ['regali', 'casa', 'tech'] },
    { name: 'Unieuro', percentage: 2.25, categories: ['regali', 'casa', 'tech'] },
    { name: 'Trony', percentage: 1.65, categories: ['regali', 'casa', 'tech'] },
    { name: 'Expert', percentage: 1.88, categories: ['regali', 'casa', 'tech'] },
    { name: 'TOYS CENTER', percentage: 4.50, categories: ['regali', 'school'] },
    { name: 'Kasanova', percentage: 3.00, categories: ['casa', 'regali'] },
    { name: 'IKEA', percentage: 4.88, categories: ['casa', 'regali'] },
    { name: 'Brico Io', percentage: 4.50, categories: ['casa', 'regali'] },
    { name: 'Bricocenter', percentage: 2.62, categories: ['casa', 'regali'] },
    { name: 'Maisons du Monde', percentage: 5.63, categories: ['casa', 'regali'] },
    { name: 'Feltrinelli', percentage: 5.25, categories: ['school', 'regali', 'tech'] },
    { name: 'Mondadori Store', percentage: 4.13, categories: ['school', 'regali', 'tech'] },
    { name: 'Libraccio.it', percentage: 4.50, categories: ['school', 'regali'] },
    { name: 'Giunti al Punto', percentage: 4.13, categories: ['school', 'regali'] },
    { name: 'Hoepli.it', percentage: 4.88, categories: ['school', 'regali'] },
    { name: 'IBS.it', percentage: 4.50, categories: ['school', 'regali'] },
    { name: 'Decathlon', percentage: 4.13, categories: ['regali', 'abb'] },
    { name: 'Gamelife', percentage: 3.00, categories: ['regali', 'tech'] },
    { name: 'Google Play IT', percentage: 2.25, categories: ['regali', 'tech'] },
    { name: 'Grand Vision Italy', percentage: 4.50, categories: ['regali'] },
    { name: 'Signorvino', percentage: 4.13, categories: ['regali', 'alim'] },
    { name: 'QC SPA', percentage: 5.62, categories: ['regali'] },
    { name: 'Swarovski', percentage: 7.13, categories: ['regali'] },
    { name: 'Smartbox', percentage: 6.37, categories: ['regali'] },
    { name: 'Xbox', percentage: 5.63, categories: ['regali', 'tech'] },
    { name: 'Tannico.it', percentage: 4.88, categories: ['regali', 'alim'] },
    { name: 'GetYourGuide', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'VISTASì', percentage: 4.13, categories: ['regali'] },
    { name: 'Global Hotel Card', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'LEGO', percentage: 4.13, categories: ['regali'] },
    { name: 'Boscolo', percentage: 12.38, categories: ['regali', 'treni'] },
    { name: 'Interflora', percentage: 7.88, categories: ['regali'] },
    { name: 'XBOX Live', percentage: 5.63, categories: ['regali', 'tech'] },
    { name: 'DAZN FULL', percentage: 3.38, categories: ['regali'] },
    { name: 'Lastminute', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'Piquadro.com', percentage: 8.63, categories: ['regali', 'abb'] },
    { name: 'AS Roma', percentage: 3.75, categories: ['regali', 'abb'] },
    { name: 'Best Western Hotels & Resorts', percentage: 4.13, categories: ['regali', 'treni'] },
    { name: 'DisneyPlus Premium', percentage: 2.63, categories: ['regali'] },
    { name: 'Global Experiences Card', percentage: 5.25, categories: ['regali'] },
    { name: 'Abbonamenti.it', percentage: 5.63, categories: ['regali'] },
    { name: 'Venchi', percentage: 4.13, categories: ['regali', 'alim'] },
    { name: 'WeRoad', percentage: 5.63, categories: ['regali', 'treni'] },
    { name: 'Hotelgift', percentage: 3.75, categories: ['regali', 'treni'] },
    { name: 'Twitch', percentage: 2.25, categories: ['regali', 'tech'] },
    { name: 'Winelivery', percentage: 3.00, categories: ['regali', 'alim'] },
    { name: 'Ecobnb', percentage: 4.13, categories: ['regali', 'treni', 'casa'] },
    { name: 'Flightgift', percentage: 2.63, categories: ['regali', 'treni'] },
    { name: 'Salute Semplice', percentage: 7.88, categories: ['regali', 'igiene'] },
    { name: 'Activitygift', percentage: 4.87, categories: ['regali'] },
    { name: 'FAO Schwarz', percentage: 4.88, categories: ['regali'] },
    { name: 'HotelsGift', percentage: 3.75, categories: ['regali', 'treni'] },
    { name: 'I primi 3 mesi di Sky TV + Sky Calcio + Sky Sport', percentage: 3.38, categories: ['regali'] },
    { name: 'I primi 3 mesi di Sky TV e Netflix (Intrattenimento plus) + Sky Cinema', percentage: 3.38, categories: ['regali'] },
    { name: 'UTravel', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'Zoologos', percentage: 3.75, categories: ['regali', 'casa'] },

    // ESEMPIO AFFILIAZIONI INTERNET
    { name: 'AliExpress', percentage: 6.92, categories: ['aff_int'] },
    { name: 'Nespresso', percentage: 7.00, categories: ['aff_int'] },
    { name: 'Folletto', percentage: 6.00, categories: ['aff_int'] },
    { name: 'Avon', percentage: 7.00, categories: ['aff_int'] },
    { name: 'Nord Vpn', percentage: 40.00, categories: ['aff_int'] },
    { name: 'Panda security', percentage: 35.00, categories: ['aff_int'] },
    { name: 'Thun', percentage: 8.00, categories: ['aff_int'] },
    { name: 'Kaspersky', percentage: 20.00, categories: ['aff_int'] },
    { name: 'Wondershare', percentage: 30.00, categories: ['aff_int'] },
    { name: 'Axa', percentage: 12.00, categories: ['aff_int'] },
    { name: 'Veratour', percentage: 0, fixedAmount: 21, categories: ['aff_int'] },
    { name: 'Babbel', percentage: 0, fixedAmount: 60, categories: ['aff_int'] },
    { name: 'Verymobile', percentage: 0, fixedAmount: 15, categories: ['aff_int'] },
    { name: 'Bidoo', percentage: 0, fixedAmount: 5, categories: ['aff_int'] },
    { name: 'Uni salute', percentage: 0, fixedAmount: 26.93, categories: ['aff_int'] },
    { name: 'La Stampa', percentage: 0, fixedAmount: 12, categories: ['aff_int'] },
    { name: 'La Repubblica', percentage: 0, fixedAmount: 12, categories: ['aff_int'] },
    { name: 'Allianz Assicurazioni', percentage: 0, fixedAmount: 13, categories: ['aff_int'] },
    { name: 'Telepass', percentage: 0, fixedAmount: 25, categories: ['aff_int'] },
    { name: 'Ho Mobile', percentage: 0, fixedAmount: 11, categories: ['aff_int'] },
    { name: 'Lycamobile', percentage: 0, fixedAmount: 10, categories: ['aff_int'] }
].sort((a, b) => a.name.localeCompare(b.name));



const uiTexts = {
    it: {
        title: "Calcolatore Cashback PRO",
        subtitle: "Personalizza le tue spese mensili per categoria",
        totalSpend: "Spesa Totale",
        monthlyReturn: "Ritorno Mensile",
        selectBrand: "SELEZIONA BRAND",
        other: "ALTRO...",
        return: "ritorno",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Aggiungi Altra Categoria",
        categories: "categorie",
        cat: {
            alim: "Alimentari",
            igiene: "Igiene personale",
            carb: "Carburante",
            tech: "Hi-Tech",
            treni: "Trasporti",
            school: "Materiale scolastico",
            abb: "Abbigliamento",
            casa: "Casa",
            regali: "Regali e Svago",
            md: "Discount",
            aff_int: "Esempio affiliazioni internet",
        },
        estimatedBill: "BOLLETTA STIMATA",
        payOnly: "Paghi solo",
        save: "Risparmi",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Hai coperto il",
        extra: "extra!"
    },
    de: {
        title: "Cashback Rechner PRO",
        subtitle: "Personalisiere deine monatlichen Ausgaben nach Kategorie",
        totalSpend: "Gesamtausgaben",
        monthlyReturn: "Monatliche Rückvergütung",
        selectBrand: "MARKE WÄHLEN",
        other: "ANDERE...",
        return: "Rückvergütung",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Kategorie hinzufügen",
        categories: "Kategorien",
        cat: {
            alim: "Lebensmittel",
            igiene: "Persönliche Pflege",
            carb: "Treibstoff",
            tech: "Elektronik & Tech",
            treni: "Transport",
            school: "Schulmaterial",
            abb: "Kleidung",
            casa: "Zuhause",
            regali: "Geschenke & Freizeit",
            md: "Discounter",
            aff_int: "Internet-Affiliates Beispiel",
        },
        estimatedBill: "GESCHÄTZTE RECHNUNG",
        payOnly: "Nur noch",
        save: "Ersparnis",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Sie haben",
        extra: "extra!"
    }
};

export const CashbackDetailedModal: React.FC<CashbackDetailedModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialDetails
}) => {
    const { language } = useLanguage();
    // Default to 'it' if language is undefined or not supported
    const lang = (language === 'de') ? 'de' : 'it';
    const txt = uiTexts[lang];
    const modalRef = useRef<HTMLDivElement>(null);



    const defaultCategories: CashbackCategory[] = [
        { id: 'alim_1', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'alim_2', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'igiene_1', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'igiene_2', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'carb_1', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'carb_2', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'tech_1', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },
        { id: 'tech_2', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },
        { id: 'treni_1', name: txt.cat.treni, amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'treni_2', name: txt.cat.treni, amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'school_1', name: txt.cat.school, amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'school_2', name: txt.cat.school, amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'abb_1', name: txt.cat.abb, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'abb_2', name: txt.cat.abb, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'casa_1', name: txt.cat.casa, amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'casa_2', name: txt.cat.casa, amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'regali_1', name: txt.cat.regali, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'regali_2', name: txt.cat.regali, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'aff_int_1', name: txt.cat.aff_int, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'aff_int_2', name: txt.cat.aff_int, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
    ];

    const [categories, setCategories] = useState<CashbackCategory[]>(defaultCategories);
    const [targetBill, setTargetBill] = useState<number>(0);

    // Update categories when language changes
    useEffect(() => {
        setCategories(prev => prev.map(cat => {
            const baseId = cat.id.replace(/_\d+$/, '');
            const defKey = Object.keys(txt.cat).find(k => k === baseId) as keyof typeof txt.cat | undefined;
            if (defKey) {
                return { ...cat, name: txt.cat[defKey] };
            }
            return cat;
        }));
    }, [lang]);

    useEffect(() => {
        if (isOpen) {
            handleReset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialDetails && initialDetails.length > 0 && !isOpen) {
            // Map existing saved details only if modal is NOT being opened fresh
            const initialMap = new Map(initialDetails.map(d => [d.id, d]));

            // Iterate over ALL default fixed categories
            // If we have saved data for that category, use it (amount, brand, percentage)
            // If not (e.g. new 'tech' category), use default
            const merged = defaultCategories.map(defCat => {
                const saved = initialMap.get(defCat.id);
                if (saved) {
                    return {
                        ...defCat,
                        amount: saved.amount,
                        brand: saved.brand,
                        percentage: saved.percentage,
                    };
                }
                return defCat;
            });
            setCategories(merged);
        } else {
            setCategories(defaultCategories);
        }
    }, [initialDetails, isOpen, lang]);

    const handleUpdate = (id: string, field: keyof CashbackCategory, value: string | number) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === id) {
                if (field === 'brand') {
                    const brandData = BRANDS_DATA.find(b => b.name === value);
                    return {
                        ...cat,
                        brand: value as string,
                        percentage: brandData ? brandData.percentage : cat.percentage,
                        fixedAmount: brandData ? brandData.fixedAmount : undefined
                    };
                }
                return { ...cat, [field]: value };
            }
            return cat;
        }));
    };



    const handleReset = () => {
        setCategories(categories.map(cat => ({ ...cat, amount: 0, brand: '', percentage: 0, fixedAmount: undefined })));
        setTargetBill(0);
    };

    // Calculate totals
    const totalSpend = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalCashback = categories.reduce((sum, cat) => {
        if (cat.fixedAmount !== undefined) {
            return sum + (cat.brand ? cat.fixedAmount : 0);
        }
        return sum + (cat.amount * cat.percentage / 100);
    }, 0);

    // Calculate averages and bill coverage
    const averagePercentage = totalSpend > 0 ? (totalCashback / totalSpend) * 100 : 0;

    // Bill Eraser Logic
    const percentageCovered = targetBill > 0 ? (totalCashback / targetBill) * 100 : 0;
    const isBillCovered = targetBill > 0 && totalCashback >= targetBill;
    const remainingToPay = Math.max(0, targetBill - totalCashback);
    const extraProfit = Math.max(0, totalCashback - targetBill);
    const discountPercent = Math.min(100, percentageCovered);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[100000] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="share-modal-content bg-white dark:bg-gray-900 w-full h-full sm:h-auto sm:max-w-4xl sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[100vh] sm:max-h-[90vh] overflow-hidden border border-purple-500/20">

                {/* Header */}
                <div className="p-1 sm:px-4 sm:py-0.5 bg-gradient-to-br from-purple-700 via-purple-600 to-blue-700 text-white shrink-0 relative overflow-hidden">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="flex justify-between items-center mb-1 sm:mb-1 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1 sm:p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <ShoppingBag size={18} className="text-purple-100 sm:w-6 sm:h-6" />
                            </div>
                            <h2 className="text-lg sm:text-lg font-black tracking-tight uppercase">
                                {txt.title}
                            </h2>
                            <SharyTrigger
                                message="Inserisci per ogni categoria l'importo di spesa e poi seleziona il brand che vuoi. Nota immediatamente la percentuale di cashback! E se vuoi, imposta in alto un importo di bolletta e osserva come diminuisce con il cashback, buon divertimento!"
                                messageDe="Gib für jede Kategorie den Ausgabenbetrag ein und wähle dann die gewünschte Marke. Beachte sofort den Cashback-Prozentsatz! Und wenn du willst, gib oben einen Rechnungsbetrag ein und beobachte, wie er durch das Cashback sinkt. Viel Spaß!"
                            />
                        </div>
                        <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-1 mt-0.5 sm:mt-0.5 relative z-10">
                        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-lg p-1 sm:p-1.5 flex-1 border border-white/20 shadow-lg">
                            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-200/70 mb-0">{txt.totalSpend}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-lg sm:text-lg font-black tracking-tighter sm:leading-none">€ {totalSpend.toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE', { maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <div className="bg-white text-gray-900 rounded-xl sm:rounded-lg p-1 sm:p-1.5 flex-1 shadow-2xl shadow-purple-900/40 border border-white/50">
                            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-purple-600 mb-0">{txt.monthlyReturn}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-lg sm:text-lg font-black tracking-tighter text-purple-900 sm:leading-none">€ {totalCashback.toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    {/* BILL ERASER SECTION */}
                    <div className="bg-white/10 backdrop-blur-xl mt-0.5 sm:mt-0.5 rounded-xl sm:rounded-lg p-1.5 sm:p-1.5 border border-white/20 relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:mb-3">
                            <div className="flex-1 w-full sm:w-auto">
                                <div className="flex items-center justify-between sm:block">
                                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-purple-200">{txt.estimatedBill}</p>
                                    <div className="flex items-center gap-2 sm:mt-0.5 bg-white/10 hover:bg-white/20 focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-white/30 px-3 py-1 sm:py-1 rounded-xl border border-white/20 transition-all cursor-text group/input" onClick={(e) => {
                                        const input = e.currentTarget.querySelector('input');
                                        if (input) input.focus();
                                    }}>
                                        <span className="text-white font-black text-xs sm:text-xl">€</span>
                                        <input
                                            type="number"
                                            value={targetBill || ''}
                                            onChange={(e) => setTargetBill(Math.max(0, parseFloat(e.target.value) || 0))}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="0"
                                            className="w-16 sm:w-40 font-black text-sm sm:text-2xl text-white bg-transparent outline-none p-0 placeholder:text-white/20 transition-all"
                                        />
                                        <div className="p-1 rounded-lg bg-white/10 text-white/40 group-hover/input:text-white/70 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-1 w-full sm:w-auto">
                                <div className="bg-white/10 rounded-xl p-2 border border-white/10 backdrop-blur-md">
                                    <div className="flex justify-between sm:justify-end items-center sm:items-baseline gap-2">
                                        <p className="text-[8px] sm:text-xs font-bold text-purple-200 uppercase">{txt.payOnly}</p>
                                        <p className="font-black text-sm sm:text-4xl text-white">€{remainingToPay.toFixed(0)}</p>
                                    </div>
                                    <p className="text-[7px] sm:text-xs font-bold text-purple-200 text-right opacity-80">
                                        Risparmi <span className="text-white">€{totalCashback.toFixed(0)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-1.5 sm:h-2 bg-gray-100/30 rounded-full overflow-hidden relative sm:mt-2">
                            <div
                                className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                style={{ width: `${Math.min(100, percentageCovered)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-gray-50/50 dark:bg-gray-950 custom-scrollbar">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white dark:bg-gray-900 p-2 rounded-2xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all group hover:border-purple-200">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

                                {/* LEFT SECTION: Icon + Name (Desktop) / TOP ROW (Mobile) */}
                                <div className="flex items-center justify-between sm:justify-start sm:w-[35%] shrink-0">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm ${cat.isExtra ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40' : 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 dark:from-purple-900/40 dark:to-indigo-900/40'}`}>
                                            {React.cloneElement(getIcon(cat.icon), { size: 20, className: "sm:w-6 sm:h-6" })}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-sm sm:text-base text-gray-900 dark:text-white truncate uppercase sm:normal-case tracking-tight">{cat.name}</h3>
                                            <p className="hidden sm:block text-[9px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{cat.isExtra ? 'Promozione' : 'Budget Famiglia'}</p>
                                        </div>
                                    </div>

                                    {/* Mobile Result (Hidden sm) */}
                                    <div className="text-right sm:hidden">
                                        <p className="font-black text-sm text-gray-900 dark:text-white">
                                            € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SECTION: Inputs Grid (Desktop) / BOTTOM ROW (Mobile) */}
                                <div className="grid grid-cols-12 sm:flex-1 items-center gap-2">

                                    {/* Amount Input */}
                                    <div className="col-span-4 sm:flex-1 relative">
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px] sm:text-xs">€</div>
                                        <input
                                            type="number"
                                            value={cat.amount || ''}
                                            onChange={(e) => handleUpdate(cat.id, 'amount', parseFloat(e.target.value) || 0)}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="0"
                                            className="w-full pl-5 pr-1 py-1 sm:py-1.5 bg-gray-50 dark:bg-gray-800/80 rounded-lg text-right font-black text-xs sm:text-sm text-gray-900 dark:text-white border border-gray-100 dark:border-white/10 outline-none transition-all shadow-inner"
                                        />
                                    </div>

                                    {/* Brand Dropdown */}
                                    <div className="col-span-4 sm:flex-[1.8] relative">
                                        <select
                                            value={cat.brand}
                                            onChange={(e) => handleUpdate(cat.id, 'brand', e.target.value)}
                                            className="w-full py-1 sm:py-1.5 px-1 sm:px-2 appearance-none bg-gray-50 dark:bg-gray-800/80 rounded-lg text-[8px] sm:text-xs font-black text-gray-600 dark:text-gray-200 tracking-wide uppercase border border-gray-100 dark:border-white/10 outline-none cursor-pointer text-center truncate shadow-inner"
                                        >
                                            <option value="">{txt.selectBrand}</option>
                                            {BRANDS_DATA
                                                .filter(brand => {
                                                    const baseId = cat.id.replace(/_\d+$/, '');
                                                    return brand.categories && brand.categories.includes(baseId);
                                                })
                                                .map(brand => (
                                                    <option key={brand.name} value={brand.name}>{brand.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Percentage Input */}
                                    <div className="col-span-4 sm:flex-[1] relative">
                                        {cat.fixedAmount !== undefined ? (
                                            <div className="w-full py-1 sm:py-1.5 text-right font-black text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                                                €{cat.fixedAmount.toFixed(0)}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={cat.percentage || ''}
                                                    onChange={(e) => handleUpdate(cat.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="0"
                                                    className="w-full pr-4 sm:pr-6 py-1 sm:py-1.5 bg-transparent text-right font-black text-xs sm:text-sm text-purple-600 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/50 outline-none"
                                                    step="0.1"
                                                />
                                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-purple-400 font-bold pointer-events-none">%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Result (Visible sm only) */}
                                    <div className="hidden sm:block sm:w-32 text-right shrink-0">
                                        <p className="font-black text-lg sm:text-2xl text-gray-900 dark:text-white truncate">
                                            € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 z-10 safe-area-bottom pb-8 sm:pb-8 flex flex-row items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm font-bold border border-red-100 active:scale-95 group"
                    >
                        <RotateCcw size={16} />
                        <span className="text-[10px] sm:text-xs uppercase font-black">{txt.reset}</span>
                    </button>

                    <button
                        onClick={() => onConfirm(totalSpend, totalCashback, categories)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-purple-500/40 active:scale-[0.98] transition-all text-xs sm:text-xl uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        {txt.confirm}
                        <Check size={18} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div >

        </div >
    );
};
