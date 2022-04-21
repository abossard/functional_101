// from https://doc.rust-lang.org/rust-by-example/fn/hof.html

fn is_odd(n: u32) -> bool {
    n % 2 == 1
}

fn string_to_length(s: &str) -> usize {
    s.len()
}

fn number_to_string(n: usize) -> String {
    n.to_string()
}

macro_rules! compose {
    ( $last:expr ) => { $last };
    ( $head:expr, $($tail:expr), +) => {
        compose_two($head, compose!($($tail),+))
    };
}

fn compose_two<A, B, C, G, F>(f: F, g: G) -> impl Fn(A) -> C
where
    F: Fn(A) -> B,
    G: Fn(B) -> C,
{
    move |x| g(f(x))
}



fn main() {
    println!("Find the sum of all the squared odd numbers under 1000");
    let upper = 1000;

    // Functional approach
    let sum_of_squared_odd_numbers: u32 =
        (0..).map(|n| n * n)                             // All natural numbers squared
             .take_while(|&n_squared| n_squared < upper) // Below upper limit
             .filter(|&n_squared| is_odd(n_squared))     // That are odd
             .fold(0, |acc, n_squared| acc + n_squared); // Sum them
    println!("functional style: {}", sum_of_squared_odd_numbers);
    
    
    let string_lengther = compose!(string_to_length, number_to_string);
    println!("functional style: {}", string_lengther("hello"));
}
