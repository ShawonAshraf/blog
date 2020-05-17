---
title: Swift - PAT or Generics?
date: '2019-06-21'
---

### PAT?

Before we begin, let me explain the terms here. PAT means Protocols with associated types. PATs can be generic, which means you can use any type with them, ([You can refer to this post I wrote earlier on how Protocols in Swift can be used as generic types](https://shawonashraf.github.io/blog/swift-associated-type-generic/)) add type constraints and so on. Let's see an example -

```swift
protocol PlayerDescriptorProtocol {
    func describeSpeciality()
}
```

Here we have a Protocol named `PlayerDescriptorProtocol` which has a function named `getSpeciality`. The type conforming to this protocol will have to supply in an implementation for this function to describe the speciality of a player. Which is fine till this point but we should be asking, what type of `Player` should conform to this protocol? Is it a Football player or a Tennis player? Or is it a Cricket player? Because to think of it in this way, players of different types will have different specialities, won't they?

So let's make this one a bit less ambiguous. We will be adding an associated type here.

```swift
protocol PlayerDescriptorProtocol {
    associatedtype PlayerType
    func describeSpeciality(of type:PlayerType)
}
```

Let's check with a conforming type. Before that, let's make a player type.

```swift
struct CricketPlayer {
    var name: String
    var age: Int
    var speciality: String
    var infoPage: String

    init(name: String, age: Int, speciality: String, infoPage: String) {
        self.name = name
        self.age = age
        self.speciality = speciality
        self.infoPage = infoPage
    }
}

let shaks = CricketPlayer(
    name: "Shakib Al Hasan",
    age: 32,
    speciality: "All-Rounder",
    infoPage: "http://www.espncricinfo.com/bangladesh/content/player/56143.html"
)
```

Now let's get a conforming type for our protocol.

```swift
struct CricketPlayerDescriptor: PlayerDescriptorProtocol {
    typealias PlayerType = CricketPlayer

    func describeSpeciality(of type: PlayerType) {
        print("\(type.speciality)")
    }
}
```

```swift
var cricketDescriptor = CricketPlayerDescriptor()
cricketDescriptor.describeSpeciality(of: shaks)
```

And we should be expecting the following output -

```
All-Rounder
```

All's fine now, right? I mean throwing in a FootballPlayer or TennisPlayer won't hurt now. But hold on dear Watson, we've things to discuss.

### What can go wrong here?

Nothing actually unless you really care about low level performance of your applications. How do you think the compiler figures out what type to use for the PAT? Sure, generic types work like that, the compiler will figure out the type to apply but the question is when does it figure it out?

#### Enter Dynamic Dispatch

For PATs, the compiler will have to figure out the type at runtime, which means it has to do it with dynamic dispatch. What is this thing actually? Dynamic Dispatch means to defer something until runtime instead of doing it all at compile time. Dynamic Dispatch is helpful in situations where the compiler doesn't know which type to apply to your function or objects immediately so it keeps them to be determined later (runtime).

Let's clear it up with an example. You're in an ice cream parlour. There are 3 new flavours today but you don't know how they taste! On top of that you happen to have the luxury to buy them all. So what you do is, buy them all and then find out how they taste. (Don't blame me if they taste bad). You just did a dynamic dispatch! Had you asked for testers at the counter and then bought the flavour you liked, that'd be static dispatch.

#### Static Dispatch

Static Dispatch is just the opposite. The compiler already knows what to do, has a clear idea about types in use, so it does everything during compile time.

#### Is Static Dispatch faster?

Comparatively, yes. But is it better than Dynamic Dispatch? You've to understand that both are for different tasks and your compiler is already designed to make them work pretty efficiently. What if, you can use both and now, you've to choose one?

### Generics and Static Dispatch

Let's re-write the same code using generics. A bit differently.

```swift
protocol PlayerDescriptorProtocol {
    func describeSpeciality()
}
```

```swift
struct CricketPlayer : PlayerDescriptorProtocol {
    var name: String
    var age: Int
    var speciality: String
    var infoPage: String

    init(name: String, age: Int, speciality: String, infoPage: String) {
        self.name = name
        self.age = age
        self.speciality = speciality
        self.infoPage = infoPage
    }

    func describeSpeciality() {
        print(speciality)
    }
}
```

```swift
let shaks = CricketPlayer(
    name: "Shakib Al Hasan",
    age: 32,
    speciality: "All-Rounder",
    infoPage: "http://www.espncricinfo.com/bangladesh/content/player/56143.html"
)
```

```swift
// generic method
func describePlayer<PlayerType: PlayerDescriptorProtocol>(of type: PlayerType) {
    type.describeSpeciality()
}
```

Let's test it out!

```swift
describePlayer(of: shaks)

// output : All-Rounder
```

### Both did the same job....

Yes they did. So, which one to choose then? Dynamic or Static? To make a verdict, we have to consider the following -

1. While generics will be faster due to Static Dispatch, it'll also be heavier on memory compared to PATs with dynamic types. Why? Because for each type, the compiler will push a new function to the stack whereas for PAT, due to the dynamic dispatch only the required function will be created.
2. What if you don't want the Player class to conform to the protocol and also want to keep separate definition for descriptor classes? You'll end up writing more code!

In my view, pick the one you need. If you don't mind sacrificing a bit more memory to get some extra performance from the compiler, then go for generics, else, choose the convenience of PATs. It's more like choosing between `struct` and `class`, since there's no absolute winner here, pick the one that does your job.

### Enough chit chat

Let's cool off with a song.

<iframe src="https://open.spotify.com/embed/track/6iWwfN1euztxZi1OK38HbU" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
