extern crate noise;

use std::vec::{Vec};
use noise::{NoiseFn, Perlin, Seedable};

extern {
    fn showMessage(message: &String);
    fn alert(x: u32);
}

#[no_mangle]
pub extern fn show_message(message: &String) {
    unsafe {
        showMessage(message);
    }
}

#[no_mangle]
pub extern fn perlin(x: f32, y: f32, z: f32) -> f64 {
    let perlin = Perlin::new();
    perlin.set_seed(0);
    perlin.get([x as f64, y as f64, z as f64])
}

// Work in progress...
#[no_mangle]
pub extern fn get_perlin_field(cols: usize, rows: usize) -> Vec<Vec<f64>> {
    let mut field: Vec<Vec<f64>> = Vec::with_capacity(cols * rows);
    for i in 0..cols {
        for j in 0..rows {
            field[i][j] = 0.123;
        }
    }
    field
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
