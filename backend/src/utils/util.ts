import { escape, stringify } from "querystring"
import { v2 as cloudinary } from 'cloudinary';

export const MAX_IMG_FILE_SIZE = 2 * 1048576 // 2 MB
export const MAX_IMG_FILE_SIZE_TXT = "2MB"

export function sanitize(value: string, encodeParams: boolean=true): string {
    if (!value)
    {
        return ""
    }

    var result: string = ""

    // Remove whitspaces before and after the string value
    result = value.trim()

    if (encodeParams)
    {
        result = encodeURI(result)
    }

    return result
}

export function is_integer(value: string): boolean {
    return Number.isInteger(value)
}

export function is_price_decimal(value: string): boolean {
    let regexp = new RegExp(/^[0-9]+(\.[0-9]?[0-9])?$/)

    return regexp.test(value)
}

export function is_valid_email(email:string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    
    return regexp.test(email)
}

export function normalise_email(email: string): string {
    if (email)
    {
        var username = email.substring(0, email.indexOf('@')).trim();
        var domain = email.substring(email.indexOf('@')+1, email.length).trim();

        return `${sanitize(username)}@${sanitize(domain)}`.toLowerCase()
    } 
    else 
    {
        return ""
    }
}

export function is_valid_base64_str(base64Str: string): boolean {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(base64Str)
}

export function calc_base64_file_size(base64Str: string): number {
    const y = (base64Str.endsWith('==')) ? 2 : 1
    return (base64Str.length * (3/4)) - y
}

export function is_valid_img_file_size(base64Str: string): boolean {
    const img_file_size = calc_base64_file_size(base64Str)
    
    return img_file_size < MAX_IMG_FILE_SIZE
}

export function is_valid_img_file(base64Str: string): boolean {
    const valid_img_types = [ '/', 'i', 'R']
    
    return valid_img_types.includes(base64Str[0])
}

export function convert_img_to_datauri(base64Str: string): string {
    var mime_type = ""
    switch (base64Str[0])
    {
        case "/":
            mime_type = "image/jpg"
            break
        case "i":
            mime_type = "image/png"
            break
        case "R":
            mime_type = "image/gif"
            break
    }

    return `data:${mime_type};base64,${base64Str}`
}

export async function upload_image_to_cloudinary(base64Str: string): Promise<any|null> {
    const data_uri = convert_img_to_datauri(base64Str)
    return cloudinary.uploader.upload(data_uri)
}

export function is_complex_password(password: string): boolean {
    // Ref: https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
    let complexPassRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/)
    return complexPassRegex.test(password)
}

export function convert_to_decimal_price(price: number): number{
    return price/100.0
}