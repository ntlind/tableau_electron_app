# Graphik:

## Discovery

- Why are you really here? Why go through all of this trouble?
  - Tableau is a fantastic tool for building data visualizations, but it's become bloated, slow, and expensive since the Salesforce acquisition. I want to build an alternative app that I can use to quickly build high-quality D3 visualizations. In particular, I need a better way to graph map data.
- What is the higher calling of this idea?
  - Build the de facto open source visualization software
- What about this idea excites you?
  - Great opportunity to build an Electron app
  - There aren't any easy, great map visualization tools
  - Automating the visualization discovery process: once we have a particularly data format in mind, we can auto-generate all of the interesting data visualizations for users
- What about this idea scares you?
  - That it isn't a good use of time because it'll be difficult to monetize
- What values does your company stand for?
  - Focus on learning; target engineering excellence
  - Build products that people will actually use
- How will your users add value to each other (the ultimate form of leverage)?
  - Share visualizations withone another
- On a scale of 1-10, how passionate are you to solve this problem?
  - 8
- How much time and capital are you willing to devote to this effort?
  - No capital aside from AWS hosting costs
  - Two months of effort (by end of August)
- What are you willing to give up to make this idea work?
  - My free time
- What community of people will you begin to lead if you create this product?
  - The consulting / data analyst communities
- What theses or assumptions are you making with this idea?
  - That existing mapping tools are a pain
  - That people would use a sleeker, more refined
- How will you get new paying customers?
  - Not planning to
- Why will your paying customers tell their friends and colleagues?
  - The product will be easy and free
- Will this business work at a scale that you can both achieve and are happy living with?
  - Yes; I don't think it will scale much
- Is it easy to start?
  - Yes
- If it is, what will keep others from starting it?
  - The people who serve this market don't have my design + engineering skills
- How do you avoid a race to the bottom where you’re trapped making a cheap commodity as a middleperson?
  - ... it's open source
- Will it get easier as you go? Why?
  - Yes; component design will be reusable
- What incentive do customers have to stick with you instead of switching to a cheaper or more convenient choice?
  - We'll be the cheapest, most convenient source

## Product Formulation

### Visioning

- Why does your product exist? What is your product's job to be done?
  - My product is for people who believe that modern "data exploration" tools create clumsy visualizations. I will focus on people who value ease-of-use and aesthetics over comprehensive feature sets. I promise that I will help my users discover new visualization designs and patterns.
- How will the product work?
  - User will upload their data via csv, xlsx, etc.
  - They'll sort out their columns into a few data selection categories
  - They'll view a grid of potential visualizations and double-click on the one they want
  - They'll be able to change the template / theme of their visuals
- What makes your product better than anything else in the world?
  - Aesthetics / lack of clutter
  - Ease-of-use
  - It's free
  - Ease of sharing visualization with others
- What is extreme / remarkable about this idea?
  - That we could decouple visualization tools from dashboarding / reporting tools
- What challenges will we face when building this idea?
  - Building interactive features on top of D3
  -

### Customers

- Which segment is desperately looking for this product? Who will be the customer who loves your product enough to not only give it a chance, but also to share it with their friends?
  - Students, consultants, and data scientists
- What is the essence of their dissatisfaction? If they read this answer, would they say “thanks, I wish I’d thought of putting it that way”?
- Who needs this product but isn't looking?
  - Consultants who use Excel and Powerpoint to create visualizations
- Who doesn't need this product? Who is this product not for?
- Write a tweet from a hypothetical customer explaining the product and how it eliminates their dissatisfaction.
- What “metrics of goodness” do your target customers care about? Does your product dominate every available alternative on these metrics?
  - Time to visualize
  - Visualization variety
- During which customer touchpoints / channels will each segment interact with this product?
- How will customers learn about this product?
  - Hacker News
  - Reddit
- How much education will my target customers need about this product?
  - Almost none; will c

### Framing your customer message

- Problem statement
- Positioning Statement (what your product does)
  - My idea (working product name) is for (target customer) who have (list specific problem). My product solves this issue by (explain solution) because I believe (list values).
  - Focus on 'us'; drive change from within the customer segment
- Value proposition(why customers need your product)
  - Should do one of three things:
    ◊ Drives sales
    ◊ Reduce costs
    ◊ Reduce risks
  - Focus on user AND buyer
  - "Create tension, then relieve it"
  - "The engine of culture is status"
    ◊ Who knows and trusts you?
    ◊ What have you made better?
    ◊ Who is in your circle?
  -
- Mission statement ("The How")
- Tagline (3-6 words that articulate your company / product in a deliberate way)
  - Marketing slogans are a promise (e.g., 'Roll tide' <- promise of dominance)
- Thorough way to communicate your value prop.
  - If I understand correctly, you want to achieve the following business outcomes…
  - Which require the capabilities to...
  - And impact the following metrics...
  - Here’s how we do it…
  - And here’s how we outpace our competition…
  - For more info, you can check out the following proof points…

## Build

### Path Forward

- What does our roadmap look like?
  - July
    - Build functioning webapp
      - Intake
        - Drag and drop to load data into app
      - Charts
        - Multi-dimensional map
      - Attribute customization
        - Font
      - Sharing
        - Save file
        - Click to copy
  - August
    - Platform
      - Working Electron Prototype
      - Better data selection fields
        - List the data source
        - Add a 'time dimension' box
        - Allow users to filter data, limit the rows, and sort in the interface
      - Able to recommend galleries of potential visualizations
      - Being able to sample the product without a login online before downloading
      - Creating an interactive tutorial
    - Charts
      - Space chart
      - Pie chart
      - Gantt (?)
      - (others?)
    - Attribute customization
      - Axes formatting
      - (others?)
    - Sharing
      - Via email link
    - Build marketing website
    - Write post
- What are our key product differentiators / features? How should we prioritize development?
  - Ease of use
    - Electron app
    - Drag to upload
  - Aesthetics
    - Color palette
- Once we get our first 1000 true fans, how might we expand into the broader market?
  - Word of mouth
  - Hosting student competitions
- What are our current resource constraints?
  - Time: dont' want to overcommit to this effort
- In a perfect world, what other features or capabilities would your product eventually need?
  - Ability to quickly compare visualization styles / chart types
  - Ability to auto-recommend chart types based on the data inputs
- What emotions should your customers have when they interact with your product
  - Wow, this is so easy
  - I can't believe this is open source
