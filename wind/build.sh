cargo build --target wasm32-unknown-unknown --release;
wasm-gc target/wasm32-unknown-unknown/release/wind.wasm -o ../src/assets/wasm/wind.gc.wasm;
