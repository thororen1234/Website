export type Theme = 'light' | 'dark'

export interface Social {
    /** Icon */
    icon: string
    /** Text */
    text: string
    /** URL */
    url: string
}

export interface Skill {
    /** Text */
    text: string
    /** Description */
    description: string
    /** Progress */
    progress: number
}

export interface Project {
    /** Icon */
    icon: string
    /** Title */
    title: string
    /** Description */
    description: string
    /** Role */
    role: string
    /** Start year */
    start: number
    /** End year */
    end?: number
    /** Tasks */
    tasks: string[]
    /** URL */
    url: string
}

export interface Friend {
    /** Icon */
    icon: string
    /** Text */
    text: string
    /** URL */
    url: string
}
