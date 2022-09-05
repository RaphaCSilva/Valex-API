import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import dotenv from "dotenv";
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import { findById } from "../repositories/employeeRepository.js";
import { validateAPIkey, calculaBalance, generateCardHolderName, findCard } from "./utilService.js";

dayjs.extend(customParseFormat);
dotenv.config();
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

const expirationTimeYears = 5;
const dateFormat = "MM/YY";
const cardFlag = "mastercard";

export async function create(APIkey: string, employeeId: number, type: cardRepository.TransactionTypes){
    await validateAPIkey(APIkey);
    verifyCardAlreadyExist(employeeId, type);
    const employee = await getEmployeeByID(employeeId);
    const cardData = createCardData(employee.fullName, employeeId, type);
    await cardRepository.insert(cardData);
}

async function verifyCardAlreadyExist(employeeId: number,type: cardRepository.TransactionTypes) {
    const alreadyExist = await cardRepository.findByTypeAndEmployeeId(type,employeeId);
    if (alreadyExist) {
      throw { type: "conflict", message: "card for this type already in use"};
    }
}

async function getEmployeeByID(employeeId: number){
    const employee = await findById(employeeId);
    if(!employee) {
        throw { type: "bad_request" };
    }
    return employee;
}

function createCardData(employeeName: string, employeeId: number, type: cardRepository.TransactionTypes){
    return{
        employeeId,
        number: faker.finance.creditCardNumber(cardFlag),
        cardholderName: generateCardHolderName(employeeName),
        securityCode: generateSecurityCode(),
        expirationDate: generateExpirationDate(expirationTimeYears, dateFormat),
        isVirtual: false,
        isBlocked: false,
        type
    }
}

function generateSecurityCode(){
    const securityCode = faker.finance.creditCardCVV();
    return cryptr.encrypt(securityCode);
}

function generateExpirationDate(years: number, format: string){
    return dayjs().add(years, "year").format(format);
}

export async function activateCardService(cardId: number, cvc: string, password: string){
    const card = await findCard(cardId);
    validateExpiration(card.expirationDate);
    validateCVC(card.securityCode, cvc);
    validateAlreadyActive(card.password);
    validatePassword(password);
    const SALT = 10;
    const encryptedPassword = bcrypt.hashSync(password, SALT);
    await cardRepository.update(cardId, { password: encryptedPassword});
}

export function validateExpiration(expirationDate: string) {
    const today = dayjs().format(dateFormat);
    if (dayjs(today).isAfter(expirationDate)) {
      throw { type: "bad_request", message: "Card expirated" };
    }
}

function validateCVC(encryptCVC: string, cardCVC: string){
    if(cryptr.decrypt(encryptCVC) !== cardCVC){
        throw { type: "bad_request", message: "incorrect CVC"};
    }
}

function validateAlreadyActive(password: string | null){
    if(password!==null){
        throw {type: "bad_request", message: "card already activated"};
    }
}

function validatePassword(password: string){
    const regex = /^[0-9]{4}$/;
    if(!regex.test(password)){
        throw { type: "bad_request", message: "password need to be four numbers"};
    }
}

export async function findTransactions(id: number){
    const card = await findCard(id);
    if (card.password === null) throw { type: "bad_request", message: "card inactive" };
    const transactions = await paymentRepository.findByCardId(id);
    const recharges = await rechargeRepository.findByCardId(id);
    const balance = calculaBalance(transactions, recharges);
    
    return { 
        balance, 
        transactions, 
        recharges 
    }
}

export async function block(id: number, password: string){
    const card = await findCard(id);
    validateActivated(card.password);
    validateExpiration(card.expirationDate);
    validateBlocked(card.isBlocked);
    verifyPassword(password, card.password);
    
    await cardRepository.update(id, {isBlocked: true});
}

export function verifyPassword(password: string, cardPassword: string) {
    if (!bcrypt.compareSync(password, cardPassword)) {
      throw { type: "unauthorized", message: "wrong password" };
    }
}

export function validateBlocked(blocked: boolean) {
    if (blocked) {
      throw { type: "bad_request", message: "this card is blocked" };
    }
}

export function validateActivated(password: string | null) {
    if (password === null) {
      throw { type: "bad_request", message: "card inactive" };
    }
}

export async function unblock(id: number, password: string){
    const card = await findCard(id);
    validateActivated(card.password);
    validateExpiration(card.expirationDate);
    validateUnblocked(card.isBlocked);
    verifyPassword(password, card.password);
    
    await cardRepository.update(id, {isBlocked: false});
}

function validateUnblocked(blocked: boolean) {
    if (!blocked) {
      throw { type: "bad_request", message: "this card is already unblocked" };
    }
}