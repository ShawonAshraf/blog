---
title: Collocation discovery with PMI
date: '2020-04-14'
---

## What is a collocation?

```bash
high hopes
valiant heart
fat cat
eternal wait
cutie pie
forever love
pathetic liar
```

If you look closely, these phrases or combination of words often occur together in a piece of text. Although they don't always have to be related (i.e. idioms, which don't share any lexical relation) they do give insights into the meaning and emphasis of the word. Take the combination `valiant heart` for example; `valiant` being an `adjective` here is adding some depth to the meaning of `heart`. However, when you figure out their meanings separately they no longer give the same sense they make together. Same goes for other combinations in the list as well.

These are called collocations. Words occurring in a certain proximity to each other, maintaining some relation that signifies their meaning.

> [A collocation is defined as] a sequence of two or more consecutive words, that has characteristics of a syntactic and semantic unit, and whose exact and unambiguous meaning or connotation cannot be derived directly from the meaning or connotation of its components. - Choueka (1988)

[^Manning, Christopher. Foundations of Statistical Natural Language Processing (The MIT Press) (pp. 183-184). The MIT Press. Kindle Edition. ]

## Importance of collocation

> You shall know a word by the company it keeps! - J.R.Firth(1957)

- Provides information on the surrounding context and subject in contention. For example, for `lazy cat` we can assume that there was a mention of something about a cat and that cat is/was lazy.
- Vital in distributional analysis of text. e.g Similarity Measurement.
- Can help in statistical machine translation when both the source corpus and the target corpus are aligned and from collocation discovery we can figure out the approximate translation from their positions in the alignment.
- And so on.

## Discovering Collocation : PMI

PMI or pointwise mutual information is an easy to use tool for discovering collocations in text. It's a frequency based technique and, originally introduced by Fano in 1961. But what does it do actually?

> The amount of information provided by the occurrence of the event represented by [y′] about the occurrence of the event represented by [x′] is defined as. - Fano

[^Manning, Christopher. Foundations of Statistical Natural Language Processing (The MIT Press) (p. 179). The MIT Press. Kindle Edition. ]

In easier words, PMI gives you the probability of one word showing up in a piece of text given that some word has showed up before it. Let's assume that we want to know the probability `x` occurring given that `y` has already occurred. According to Fano,

$$
PMI(x, y) = log_{2} \frac{P(x,y)}{P(x)P(y)} = log_{2} \frac{P(x|y)}{P(x)P(y)}
$$

As we can see from the equation above, PMI is basically measuring the conditional probability of `x` given `y`. What if we have the opposite case and have to measure probability of `y` given `x`. Same thing. Just replace `x` with `y` in the equation.

With PMI cleared up, we can now select some text, tokenize it and create every possible combination from them and check for collocation using PMI. We can create `n-gram` combinations but for the sake of keeping this article simple, I'll be creating `bigrams (n=2)` only.

## Selecting the corpus

I'll be using this [text on flowers](https://gist.github.com/ShawonAshraf/8849a3dae1c6e97473454ca49c13375b) collected from Wikipedia.

## Python libraries

I don't want to reinvent the wheel for tokenization and bigram generation so I'd be using `Spacy` and `NLTK` to do these.

### Part - 1 : Load the libraries

Create a virtualenv or conda env and install `spacy` and `nltk`. Make sure to download the spacy language model for English!

```bash
python -m spacy download en_core_web_sm
```

Now in our python script,

```python
# for tokenization
import spacy

# for log2
import math

# for bigrams
from nltk import bigrams
```

### Part - 2 : Create a Spacy model

```python
model = spacy.load('en_core_web_sm')
```

### Part - 3 : Load the corpus

```python
def load_corpus():
    with open('wiki-en-flower.txt') as text_file:
        text = text_file.read()

        return text

doc = model(load_corpus())
```

### Part - 4 : Tokenize

When you create a doc using a Spacy model, it automatically creates tokens for the doc. All we have to do now is to count the number of tokens.

```python
# count the tokens in the doc
n_tokens = len(doc)
print(f"Number of tokens in the corpus: {n_tokens}\n")
```

```bash
# output
Number of tokens in the corpus: 34236
```

### Part - 5 : Generate bigrams

Will be using NLTK for this. Why? Because Spacy doesn't have anything for bigrams.

```python
def generate_bigrams(doc):
    token_list = [str(tok) for tok in doc]

    bgs = bigrams(token_list)
    return [str(bg) for bg in bgs]


bgs = generate_bigrams(doc=doc)
```

### Part - 6 : Select the bigram to query for

Going through such a large list of bigrams is going to be tiring. Instead we're going to choose some specific bigrams, the ones that have the word `sunflower` in them. In the end we'll be checking PMI for `sunflower seed`, `sunflower oil`, `sunflower field`. You can check for other bigrams as you like.

### Part - 7 : Getting the frequencies

Since PMI is a frequency based technique(we need the frequency to get the probabilities), we have to get the frequencies now. For now, let's do it for `sunflower seed`.

```python
def count_word_frequency(word, doc):
    freq = 0
    for tok in doc:
        if tok.text == word:
            freq = freq + 1

    return freq


n_sunflower = count_word_frequency(word='sunflower', doc=doc)
n_seed = count_word_frequency(word='seed', doc=doc)


def count_bigram_frequency(k, bigrams):
    freq = 0
    for bg in bigrams:
        if bg == k:
            freq = freq + 1
    return freq


n_sunflower_seed = count_bigram_frequency(
    k="('sunflower', 'seed')", bigrams=bgs)

print(
    f"sunflower = {n_sunflower}\nseed = {n_seed}\nsunflower seed = {n_sunflower_seed}\n")
```

```bash
# output
sunflower = 37
seed = 24
sunflower seed = 6
```

### Part - 8 : PMI

```python
def probability(x, n):
    return x / n


def pmi(P_x, P_y, P_xy):
    return math.log2(P_xy / (P_x * P_y))
```

```python
p_sunflower = probability(n_sunflower, n_tokens)
p_seed = probability(n_seed, n_tokens)
p_sunflower_seed = probability(n_sunflower_seed, len(bgs))

r = pmi(p_sunflower, p_seed, p_sunflower_seed)

print(f"pmi for sunflower seed = {r}")
```

```bash
# output
pmi for sunflower seed = 7.853815306997303
```

### Part - 10 : Checking for other query bigrams

| x         | y     | C(x) | C(y) | C(x, y) | P(x)       | P(y)        | P(x, y)     | PMI     |
| --------- | ----- | ---- | ---- | ------- | ---------- | ----------- | ----------- | ------- |
| sunflower | seed  | 37   | 24   | 6       | 0.00108073 | 0.000701016 | 0.000175259 | 7.85382 |
| sunflower | oil   | 37   | 37   | 1       | 0.00108073 | 0.00108073  | 2.92099e-05 | 4.64436 |
| sunflower | field | 37   | 1    | 0       | 0.00108073 | 2.9209e-05  | 0           | 0       |

**The higher the PMI score, the more likely it is for a combination to have a collocation. However, in case the PMI is 0, there's no collocation.**

This table was generated using `tabulate`.

## Limitations of PMI

Despite doing our job, PMI has its weaknesses. It's prone to frequency bias and will weight lower or 0 frequency terms more over higher frequency terms. This may result in wrong collocation relation. One way to fix this is to apply `Laplace Smoothing` or use another technique called `Chi Square`

> But there is evidence that sparseness is a particularly difficult problem for mutual information. To see why, notice that mutual information is a log likelihood ratio of the probability of the bigram P(w1w2) and the product of the probabilities of the individual words P(w1)P(w2). Consider two extreme cases: perfect dependence of the occurrences of the two words (they only occur together) and perfect independence (the occurrence of one does not give us any information about the occurrence of the other). - Manning, Christopher

[^Manning, Christopher. Foundations of Statistical Natural Language Processing (The MIT Press) (p. 181). The MIT Press. Kindle Edition. ]

## Fertig!

I'll leave the task of checking PMI for other bigrams to you. Tschüss und guten Tag!

## Code repository for this post

[On Github](https://github.com/ShawonAshraf/collocation-pmi-blog-post-code)

## More resources

- [13 8 Word Similarity Distributional Similarity I 13 14](https://youtu.be/swDoFpuHpzQ)
- [MLE](https://www.youtube.com/watch?v=XepXtl9YKwc&t=308s)
- [Jurafsky, Martin. Speech and Language Processing (3rd ed. draft)](https://web.stanford.edu/~jurafsky/slp3/)
- [Manning, Christopher. Foundations of Statistical Natural Language Processing (The MIT Press)](https://nlp.stanford.edu/fsnlp/)
- [Chi-Square Statistic: How to Calculate It / Distribution](https://www.statisticshowto.com/probability-and-statistics/chi-square/)
- [Laplace Smoothing, Wikipedia](https://www.wikiwand.com/en/Additive_smoothing)
