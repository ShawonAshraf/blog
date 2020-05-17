---
title: The curious genericness of Associated Types
date: '2019-05-29'
---

### Before we dig deep, Protocols!

Swift introduced this new paradigm called POP or `Protocol Oriented Programming`. For people new to Swift, especially those coming from an OOP heavy language like Java or C#, Protocols may seem somewhat like interfaces. At least that's what it seems from a quick look. Protocols are actually an entirely different kind of animal from Interfaces when it comes to implementation. (_Not to mention the added benefits Protocols bring.)_

Let's say you want to have a Protocol with a method that adds two numbers and returns the sum. For now, let's just consider that we'll be adding `Int` type numbers only.

```swift
protocol Adder {
    func add(a: Int, b: Int) -> Int
}
```

Now we need to add an implementation for this method, right? So how do we do it? We create a `class` that `conforms` to this protocol.

```swift
class IntAdder: Adder {
    func add(a: Int, b: Int) -> Int {
        return a + b
    }
}
```

Let's see if that works or not!

```swift
let adder = IntAdder()
print(adder.add(a: 55, b: 45)) // prints 100
```

Now what if we don't just want to add `Int`, rather add `Float` and `Double` type numbers as well? Hold on a second, I know you'll yell out generics. **There's another way with Protocols. We can use `Associated Types.`**

### Chasing the wabbit.....What's an Associated Type?

We want our Protocol method to be generic, right? Which means we have to tell it to take some generic type in as well. But is that possible? The protocol we defined is by no means a generic one. I mean there's no special signature for it to be generic! Turns out to be the opposite actually. You can define a generic type inside the protocol. And associated types just let you do that. Let's see an example.

```swift
protocol Adder {
    associatedtype Number
    func add(a: Number, b: Number) -> Number
}
```

Notice the difference, we created a type out of nowhere and now our function can work with it!

What an `associatedtype` does is it actually tells the compiler that, listen dear compiler, my functions are a confused bunch of people who don't know whom they should let in, so pardon them for a while and I'm adding a type name or placeholder for these whom kinda people who're about to come in so that you can tag them later on.

In other words, `associatedtype` gives your imaginary type a name / id so that it doesn't get lost in the crowd.

### A bit formal definition

In case you want to define and `associatedtype` in a formal way, as Apple did (I just shared this from Apple Books app) -

> An associated type gives a placeholder name to a type that is used as part of the protocol. The actual type to use for that associated type isn’t specified until the protocol is adopted. Associated types are specified with the associatedtype keyword.

_Excerpt From_
_The Swift Programming Language (Swift 4.2)_
_Apple Inc._
_https://books.apple.com/us/book/the-swift-programming-language-swift-5-0/id881256329_
_This material may be protected by copyright._

### Back to the matter at hand

Let's add an implementation for the protocol. This time, let's add `Double` type numbers. Before we do so, we got to ask this very important question - _how do we tell our generic protocol method what type we're about to pass?_

### Typealias to the rescue!

We just need to add a `typealias` for the `associatedtype` in the class conforming to the protocol. Now how do we do that? Just assign the type you want the function to take in as the `typealias`. Okay, let's see some code again.

```swift
class DoubleAdder: Adder {
    typealias Number = Double
}
```

Now that's been dealt with, let's move on to the function itself.

```swift
func add(a: Double, b: Double) -> Double {
    return a + b
}
```

The complete `DoubleAdder` now looks like this.

```swift
class DoubleAdder: Adder {
    typealias Number = Double

    func add(a: Double, b: Double) -> Double {
        return a + b
    }
}
```

Testing again, the implementation passes out.

```swift
let adder = DoubleAdder()
print(adder.add(a: 34.67, b: 89.23)) // 123.9
```

### So interfaces ugh, protocols can be generic eh?

Turns out to be so! Protocols with Associated Types can be used as generic types. But should you be using them instead of tested and proven existing generic types? I believe that will require some serious discussion and I shouldn't be making this post any longer. Let's keep that for a separate post, shall we? Great! See you until then and keep yourself dandy!
