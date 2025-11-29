export class GetHealtUseCase {
  constructor(healtRepository) {
    this.healtRepository = healtRepository;
  }

  async execute() {
    return this.healtRepository.getHealth();
  }
}
