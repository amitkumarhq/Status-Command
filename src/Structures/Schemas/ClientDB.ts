import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export default model(
    'ClientDB', new Schema({
        Client: Boolean,
        Memory: Array,
    })
);
