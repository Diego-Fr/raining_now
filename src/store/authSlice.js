import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: '',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiIyMjgiLCJlbWFpbCI6ImRpZWdvLmZyZWl0YXMucHJvZmVzc2lvbmFsQG91dGxvb2suY29tIiwibmFtZSI6IkRpZWdvIEZyZWl0YXMgZGUgU291c2EiLCJlbmNyeXB0ZWRfcGFzc3dvcmQiOiIkMmEkMTIkVkFFNi9QNTMuaEt6U0tERDNxcEk2T3VLRm82U3VXd3hhSXlJaGFFaGJWLmhjZ0t3ejZMMzIifSwicm9sZXMiOlsiZGV2Il0sImlhdCI6MTc0NzE1NzE2NywiZXhwIjoxNzQ3MTYwNzY3fQ.gQdIBkneRrULc5QooI5dejY7DT_7e7wwinSpNSNZ6Fk',
    roles: ['dev']
}

const authSlice = createSlice({
    name: 'context',
    initialState,
    reducers:{

    }
})

export const {} =  authSlice.actions

export default authSlice.reducer