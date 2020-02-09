
import * as SecureStore from 'expo-secure-store';
import React, { useState } from "react"

const UserUUIDkey = 'UserUUIDkey'


/**
 * Return de User UUID from local store data
 */
async function getUserUUID() {

    let uuid = await SecureStore.getItemAsync(UserUUIDkey)

    if (uuid) {
        return uuid;
    }

    uuid = newGUID()
    SecureStore.setItemAsync(UserUUIDkey, uuid)
    return uuid;
}


/**
 * return a new UUID
 */
function newGUID() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


export {
    newGUID as create_UUID,
    getUserUUID,
};